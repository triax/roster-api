# Roster API

A TypeScript application that fetches team roster data from Google Sheets and converts it to JSON format.

## Overview

This application authenticates with Google Drive API using service account credentials to export team roster data from a Google Sheets spreadsheet and convert it into a structured JSON format. The application also detects and includes MIME types for all images stored in Google Drive.

## Prerequisites

- Node.js and npm installed
- Google service account credentials with access to the target Google Sheets document

## Installation

```bash
npm install
```

## Configuration

### Authentication

Provide Google service account credentials using one of these methods:

1. Environment variable:
   ```bash
   export GOOGLE_SERVICE_ACCOUNT_KEY_JSON='{"type":"service_account",...}'
   ```

2. Local file:
   Create `service-account-key.json` in the project root

### Target Spreadsheet

Set a custom Google Sheets URL (optional):
```bash
export GOOGLE_DRIVE_TARGET_FILE_URL='https://docs.google.com/spreadsheets/d/YOUR_FILE_ID'
```

## Usage

```bash
# Fetch roster data and save to data/roster.json
npm start

# Fetch roster data and output to console
npm run dev

# With dump flag
npm start -- --dump
```

## Output

The application generates `data/roster.json` with the following structure:

```json
{
  "version": "1.0",
  "updated_at": "2025-01-01T00:00:00.000Z",
  "members": [
    {
      "timestamp": "2025-01-01T00:00:00.000Z",
      "name": {
        "default": "選手名",
        "hiragana": "せんしゅめい",
        "alphabet": "Player Name"
      },
      "position": "QB",
      "jersey": 1,
      "next_introduction": "Introduction text",
      "role": "Role in team",
      "photos": {
        "serious": {
          "url": "https://drive.usercontent.google.com/...",
          "mime_type": "image/jpeg"
        },
        "casual": [
          {
            "url": "https://drive.usercontent.google.com/...",
            "mime_type": "image/png"
          }
        ]
      },
      "university": "University Name",
      "enthusiasm": "Player's enthusiasm",
      "watchme": "What to watch",
      "hobbies": "Hobbies",
      "favorite": "Favorite things",
      "gifts": "Gift preferences",
      "what_i_like_about_triax": "What they like about the team"
    }
  ]
}
```

## GitHub Actions

The repository includes a workflow that automatically updates roster data on a schedule. See `.github/workflows/update-roster-data.yml` for details.

## Features

- Fetches roster data from Google Sheets via Drive API
- Converts CSV data to structured JSON format
- Detects actual MIME types for images (e.g., image/jpeg, image/png, image/heif)
- Converts Google Drive sharing URLs to direct access URLs
- Caches metadata for improved performance
- Sorts members by jersey number

## Development

- TypeScript with ES2019 target
- Uses `tsx` for direct TypeScript execution
- Google APIs SDK for Drive/Sheets access

## License

[Add license information here]