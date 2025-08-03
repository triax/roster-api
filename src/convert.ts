import { type Member, type RosterJSON } from './types';

/**
 * Convert Google Drive sharing URLs to direct image URLs
 * @param driveUrl - The Google Drive URL to convert
 * @param useThumbnail - Whether to return thumbnail version
 * @returns Direct access URL
 */
function convertDriveUrlToDirectImageUrl(driveUrl: string, useThumbnail: boolean = false): string {
  if (!driveUrl) return '';

  // Match various Google Drive URL patterns
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
        return `https://drive.usercontent.google.com/download?id=${match[1]}&export=view`
      }
    }
  }

  // If already a direct URL or doesn't match patterns, return as is
  return driveUrl;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

function convertLineToMember(line: string): Member {
  const values = parseCSVLine(line);
  
  // Parse casual photos - can be a single URL or multiple URLs separated by commas
  const casualPhotosRaw = values[12];
  let casualPhotos: string[] = [];
  
  if (casualPhotosRaw.includes(',')) {
    // Multiple URLs separated by commas
    casualPhotos = casualPhotosRaw.split(',').map(url => url.trim());
  } else if (casualPhotosRaw) {
    // Single URL
    casualPhotos = [casualPhotosRaw.trim()];
  }
  
  return {
    timestamp: new Date(values[0]).toISOString(),
    name: {
      default: values[1],
      hiragana: values[2],
      alphabet: values[3],
    },
    position: values[4],
    jersey: values[5].length ? parseInt(values[5]) : undefined,
    // height: values[6] || undefined,
    // weight: values[7] || undefined,
    // birthdate: values[8] || undefined,
    next_introduction: values[9],
    role: values[10],
    photos: {
      serious: convertDriveUrlToDirectImageUrl(values[11]),
      casual: casualPhotos.map(url => convertDriveUrlToDirectImageUrl(url)),
    },
    // workplace: values[13] || undefined,
    university: values[14],
    enthusiasm: values[15],
    watchme: values[16],
    hobbies: values[17],
    favorite: values[18],
    gifts: values[19],
    what_i_like_about_triax: values[20],
  };
}

export function convertCSVToJSON(csvstr: string): RosterJSON {
  const lines = csvstr.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  // const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1);
  const members: Member[] = rows.map(convertLineToMember).sort((prev, next) => (prev.jersey || 100) < (next.jersey || 100) ? -1 : 1);
  return {
    version: '1.0',
    updated_at: new Date().toISOString(),
    members: members,
  };
}
