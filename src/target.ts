import { google } from 'googleapis';
import { authenticate } from './auth';
import { type GaxiosResponseWithHTTP2 } from 'googleapis/node_modules/googleapis-common/build/src/http2';
import { type Readable } from 'stream';

const TARGET_FILE_URL = 'https://docs.google.com/spreadsheets/d/1oDneEuvH7tOfXhZ1muVHiG0PrfWgh7VV1MtQ9ABKs0U/edit';

export function getTargetFileID() {
  const url = process.env.GOOGLE_DRIVE_TARGET_FILE_URL || TARGET_FILE_URL;
  const match = url.match(/[-\w]{25,}/);
  if (!match) {
    throw new Error('Invalid Google Drive file URL');
  }
  return match[0];
}

export async function getCSVContent(fileId: string): Promise<GaxiosResponseWithHTTP2<string>> {
  const auth = authenticate();
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.export({ fileId, mimeType: 'text/csv' })
  return res as GaxiosResponseWithHTTP2<string>;
}
