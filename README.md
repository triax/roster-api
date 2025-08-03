# Roster API

A TypeScript application that fetches team roster data from Google Sheets and converts it to JSON format.

## Overview

This application authenticates with Google Drive API using service account credentials to export team roster data from a Google Sheets spreadsheet and convert it into a structured JSON format.

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
  "version": "1.0.0",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "members": [
    {
      "number": 1,
      "name": "Player Name",
      "position": "Position",
      "year": "2025",
      "major": "Major",
      "birthplace": "City",
      "memo": "Additional info",
      "photo_url": "https://...",
      "photo_position": "center",
      "cover_photo_url": "https://...",
      "favorite_drink": "Drink",
      "favorite_food": "Food"
    }
  ]
}
```

## GitHub Actions

The repository includes a workflow that automatically updates roster data on a schedule. See `.github/workflows/update-roster-data.yml` for details.

## Development

- TypeScript with ES2019 target
- Uses `tsx` for direct TypeScript execution
- Google APIs SDK for Drive/Sheets access

## License

[Add license information here]