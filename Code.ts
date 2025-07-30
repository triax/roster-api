// Type definitions for roster data
interface Member {
  timestamp: string;
  name: {
    default: string; // Japanese name
    hiragana: string;
    alphabet: string;
  }
  position: string;
  jersey?: string;
  height?: string;
  weight?: string;
  birthdate?: string;
  next_introduction: string;
  role: string;
  photos: {
    serious: string;
    casual: string[]; // comma-separated URLs
  }
  workplace?: string;
  university: string;
  enthusiasm: string;
  watchme: string;
  hobbies: string;
  favorite: string;
  gifts: string;
  what_i_like_about_triax: string;
}

interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  count?: number;
}

// Utility function to convert Google Drive sharing URLs to direct image URLs
function convertDriveUrlToDirectImageUrl(driveUrl: string, useThumbnail: boolean = false): string {
  if (!driveUrl) return '';
  
  // Match various Google Drive URL patterns
  const patterns = [
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = driveUrl.match(pattern);
    if (match && match[1]) {
      if (useThumbnail) {
        return `https://drive.google.com/thumbnail?id=${match[1]}`;
      } else {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
  }
  
  // If already a direct URL or doesn't match patterns, return as is
  return driveUrl;
}

// Main entry point for GET requests
function doGet(ev: GoogleAppsScript.Events.DoGet = {} as GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const params = ev.parameter || {};
    
    // Route to appropriate handler based on query parameters
    let response: APIResponse;
    
    if (params.action === 'members' || !params.action) {
      response = handleMembersRequest(params);
    } else if (params.action === 'positions') {
      response = getAvailablePositions();
    } else {
      response = {
        success: false,
        error: 'Invalid action. Available actions: members, positions'
      };
    }
    
    output.setContent(JSON.stringify(response));
  } catch (error) {
    output.setContent(JSON.stringify({
      success: false,
      error: error.toString()
    }));
  }
  
  return output;
}

// Fetch all data from the spreadsheet
function fetchRosterData(useThumbnails: boolean = false): Member[] {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length < 2) {
    throw new Error('No data found in spreadsheet');
  }
  
  // Skip header row and process data
  const members: Member[] = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row[0] || !row[1]) continue;
    
    members.push({
      timestamp: row[0] ? new Date(row[0]).toISOString() : '',
      name: {
        default: row[1] || '',
        hiragana: row[2] || '',
        alphabet: row[3] || ''
      },
      position: row[4] || '',
      jersey: row[5] ? row[5].toString() : undefined,
      height: row[6] ? row[6].toString() : undefined,
      weight: row[7] ? row[7].toString() : undefined,
      birthdate: row[8] ? new Date(row[8]).toISOString().split('T')[0] : undefined,
      next_introduction: row[9] || undefined,
      role: row[10] || '',
      photos: {
        serious: convertDriveUrlToDirectImageUrl(row[11] || '', useThumbnails),
        casual: row[12] ? row[12].split(',').map((url: string) => convertDriveUrlToDirectImageUrl(url.trim(), useThumbnails)).filter((url: string) => url) : []
      },
      workplace: row[13] || '',
      university: row[14] || '',
      enthusiasm: row[15] || '',
      watchme: row[16] || '',
      hobbies: row[17] || '',
      favorite: row[18] || '',
      gifts: row[19] || '',
      what_i_like_about_triax: row[20] || ''
    });
  }
  
  return members;
}

// Handle requests for member data
function handleMembersRequest(params: any): APIResponse {
  const useThumbnails = params.thumbnails === 'true';
  const members = fetchRosterData(useThumbnails);
  let filteredMembers = members;
  
  // Filter by position if specified
  if (params.position) {
    filteredMembers = members.filter(m => 
      m.position.toLowerCase() === params.position.toLowerCase()
    );
  }
  
  // Filter by jersey number if specified
  if (params.jerseyNumber) {
    filteredMembers = members.filter(m => 
      m.jersey === params.jerseyNumber
    );
  }
  
  // Search by name if specified
  if (params.name) {
    const searchTerm = params.name.toLowerCase();
    filteredMembers = members.filter(m => 
      m.name.default.toLowerCase().includes(searchTerm) ||
      m.name.hiragana.toLowerCase().includes(searchTerm) ||
      m.name.alphabet.toLowerCase().includes(searchTerm)
    );
  }
  
  // Limit fields if specified
  if (params.fields) {
    const fields = params.fields.split(',');
    filteredMembers = filteredMembers.map(member => {
      const limitedMember: any = {};
      fields.forEach((field: string) => {
        if (field in member) {
          limitedMember[field] = member[field as keyof Member];
        }
      });
      return limitedMember;
    });
  }
  
  return {
    success: true,
    data: filteredMembers,
    count: filteredMembers.length
  };
}

// Get list of available positions
function getAvailablePositions(): APIResponse {
  const members = fetchRosterData(false);
  const positions = new Set(members.map(m => m.position).filter(p => p));
  
  return {
    success: true,
    data: Array.from(positions).sort()
  };
}