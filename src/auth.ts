import { google } from 'googleapis';

let authInstance: google.auth.GoogleAuth | null = null;

export function authenticate(): google.auth.GoogleAuth {
  if (authInstance) {
    return authInstance;
  }

  const keyjson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (keyjson) {
    console.log('[INFO]', 'Using GOOGLE_SERVICE_ACCOUNT_KEY_JSON from environment variable');
    authInstance = new google.auth.GoogleAuth({
      credentials: JSON.parse(keyjson),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
  } else {
    console.log('[INFO]', 'Using service account key file on local disk');
    authInstance = new google.auth.GoogleAuth({
      keyFile: 'service-account-key.json',
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
  }

  return authInstance;
}
