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

## GitHub Actions Automation

This repository includes automated roster data updates via GitHub Actions.

### Automatic Updates

The workflow (`.github/workflows/update-roster.yml`) runs:
- **Daily at 3:00 AM JST** (midnight UTC+9)
- **On-demand** via GitHub Actions UI (workflow_dispatch)
- **On push** to main branch when source files change

### Setup Instructions

1. **Add Service Account Credentials to GitHub Secrets:**
   
   a. Get your service account JSON from `service-account-key.json`
   b. Go to repository Settings → Secrets and variables → Actions
   c. Click "New repository secret"
   d. Name: `GOOGLE_SERVICE_ACCOUNT_KEY_JSON`
   e. Value: Paste the entire JSON content from your service account key file
   f. Click "Add secret"

2. **Manual Trigger:**
   
   - Go to Actions tab → "Update Roster Data" workflow
   - Click "Run workflow" → Select branch → Run

3. **Monitor Execution:**
   
   - Check Actions tab for workflow status
   - Failed runs automatically create GitHub Issues for notification

### Features

- Automatic commit of updated `data/roster.json`
- Skip commits when no data changes detected
- Error notifications via GitHub Issues
- Secure credential management via GitHub Secrets

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