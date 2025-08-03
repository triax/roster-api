# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a TypeScript application that fetches team roster data from a Google Sheets spreadsheet via Google Drive API and converts it to JSON format. The application authenticates using Google service account credentials and exports member data for the TRIAX team.

## Architecture

The application follows a simple pipeline architecture:

1. **Authentication** (`src/auth.ts`): Handles Google OAuth using service account credentials
   - Supports both environment variable and local file authentication
   - Uses `googleapis` library for API access

2. **Target Resolution** (`src/target.ts`): Extracts Google Drive file ID from URL
   - Default target is a specific Google Sheets document
   - Can be overridden via `GOOGLE_DRIVE_TARGET_FILE_URL` environment variable

3. **CSV Export** (`src/target.ts`): Exports Google Sheets as CSV using Drive API

4. **Data Conversion** (`src/convert.ts`): Parses CSV and converts to structured JSON
   - Handles complex CSV parsing including quoted fields with commas
   - Converts Google Drive image URLs to direct access URLs
   - Sorts members by jersey number

5. **File Save** (`src/save.ts`): Writes the final JSON to `data/roster.json`

## Development Commands

```bash
# Install dependencies
npm install

# Run the application (fetches and converts roster data)
npm start

# Run with console output of the roster data
npm run dev
```

## Environment Variables

- `GOOGLE_SERVICE_ACCOUNT_KEY_JSON`: JSON string containing service account credentials
- `GOOGLE_DRIVE_TARGET_FILE_URL`: Override the default Google Sheets URL

## Key Dependencies

- `googleapis`: Google API client for accessing Drive/Sheets
- `tsx`: TypeScript execution without compilation
- TypeScript with ES2019 target and Node.js module resolution

## Data Flow

1. Main entry point (`main.ts`) orchestrates the entire process
2. Member data includes personal info, position, photos, and preferences (see `src/types.ts` for `Member` and `RosterJSON` interfaces)
3. Output format follows `RosterJSON` interface with version and timestamp
4. Images are converted from Google Drive sharing URLs to direct access URLs

## Notes

- Service account credentials can be provided via environment variable or local `service-account-key.json` file
- The application is designed to run as a scheduled job
- Data specification is documented in `spec/DATA_SPEC.md`
- The `--dump` flag can be passed to output the roster JSON to console