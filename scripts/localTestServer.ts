import express from 'express';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

// Copy the interfaces and conversion function from Code.ts
interface Member {
  timestamp: string;
  name: {
    default: string;
    hiragana: string;
    alphabet: string;
  };
  position: string;
  jersey?: string;
  height?: string;
  weight?: string;
  birthdate?: string;
  next_introduction?: string;
  role: string;
  photos: {
    serious: string;
    casual: string[];
  };
  workplace?: string;
  university: string;
  enthusiasm: string;
  watchme: string;
  hobbies: string;
  favorite: string;
  gifts: string;
  what_i_like_about_triax: string;
}

interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// Copy the URL conversion function
function convertDriveUrlToDirectImageUrl(driveUrl: string, useThumbnail: boolean = false): string {
  if (!driveUrl) return '';

  const patterns = [
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
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

  return driveUrl;
}

// Read and parse CSV data
function fetchRosterDataFromCSV(useThumbnails: boolean = false): Member[] {
  const csvPath = path.join(__dirname, '../data/2025_member_info_responses - Form Responses 1.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(fileContent, {
    columns: false,
    skip_empty_lines: true,
    from_line: 2, // Skip header
  });

  const members: Member[] = [];

  for (const row of records) {
    if (!row[0] || !row[1]) continue;

    members.push({
      timestamp: row[0] ? new Date(row[0]).toISOString() : '',
      name: {
        default: row[1] || '',
        hiragana: row[2] || '',
        alphabet: row[3] || '',
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
        casual: row[12]
          ? row[12]
              .split(',')
              .map((url: string) => convertDriveUrlToDirectImageUrl(url.trim(), useThumbnails))
              .filter((url: string) => url)
          : [],
      },
      workplace: row[13] || '',
      university: row[14] || '',
      enthusiasm: row[15] || '',
      watchme: row[16] || '',
      hobbies: row[17] || '',
      favorite: row[18] || '',
      gifts: row[19] || '',
      what_i_like_about_triax: row[20] || '',
    });
  }

  return members;
}

// Create Express app
const app = express();
const PORT = 3000;

// Main API endpoint
app.get('/', (req, res) => {
  try {
    const params = req.query;
    let response: APIResponse<Member[] | string[]>;

    if (params.action === 'members' || !params.action) {
      response = handleMembersRequest(params);
    } else if (params.action === 'positions') {
      response = getAvailablePositions();
    } else {
      response = {
        success: false,
        error: 'Invalid action. Available actions: members, positions',
      };
    }

    res.json(response);
  } catch (error) {
    res.json({
      success: false,
      error: error.toString(),
    });
  }
});

// Handle member requests
function handleMembersRequest(params: Record<string, string>): APIResponse<Member[]> {
  const useThumbnails = params.thumbnails === 'true';
  const members = fetchRosterDataFromCSV(useThumbnails);
  let filteredMembers = members;

  // Filter by position if specified
  if (params.position) {
    filteredMembers = members.filter(
      (m) => m.position.toLowerCase() === params.position.toLowerCase()
    );
  }

  // Filter by jersey number if specified
  if (params.jerseyNumber) {
    filteredMembers = members.filter((m) => m.jersey === params.jerseyNumber);
  }

  // Search by name if specified
  if (params.name) {
    const searchTerm = params.name.toLowerCase();
    filteredMembers = members.filter(
      (m) =>
        m.name.default.toLowerCase().includes(searchTerm) ||
        m.name.hiragana.toLowerCase().includes(searchTerm) ||
        m.name.alphabet.toLowerCase().includes(searchTerm)
    );
  }

  // Limit fields if specified
  if (params.fields) {
    const fields = params.fields.split(',');
    filteredMembers = filteredMembers.map((member) => {
      const limitedMember: Record<string, unknown> = {};
      fields.forEach((field: string) => {
        if (field in member) {
          limitedMember[field] = member[field as keyof Member];
        }
      });
      return limitedMember as unknown as Member;
    });
  }

  return {
    success: true,
    data: filteredMembers,
    count: filteredMembers.length,
  };
}

// Get available positions
function getAvailablePositions(): APIResponse<string[]> {
  const members = fetchRosterDataFromCSV(false);
  const positions = new Set(members.map((m) => m.position).filter((p) => p));

  return {
    success: true,
    data: Array.from(positions).sort(),
  };
}

// Start server
app.listen(PORT, () => {
  console.log(`Local test server running at http://localhost:${PORT}`);
  console.log(`\nExample URLs:`);
  console.log(`  - All members: http://localhost:${PORT}/`);
  console.log(`  - Members with thumbnails: http://localhost:${PORT}/?thumbnails=true`);
  console.log(`  - Filter by position: http://localhost:${PORT}/?position=WR`);
  console.log(`  - Get positions: http://localhost:${PORT}/?action=positions`);
  console.log(`  - Search by name: http://localhost:${PORT}/?name=馬渡`);
});
