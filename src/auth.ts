import { google } from 'googleapis';

export function authenticate() {
  const keyjson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (keyjson) {
    console.log('[INFO]', 'Using GOOGLE_SERVICE_ACCOUNT_KEY_JSON from environment variable');
    return new google.auth.GoogleAuth({
      credentials: JSON.parse(keyjson),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
  }
  console.log('[INFO]', 'Using service account key file on local disk');
  return new google.auth.GoogleAuth({
    keyFile: 'service-account-key.json',
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
}
