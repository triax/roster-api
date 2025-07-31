# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Apps Script project that provides a REST API for accessing TRIAX American football team roster data. The API reads data from Google Sheets and returns JSON responses with member information, supporting filtering and field selection.

## Development Commands

- `npm run build` - Compile TypeScript files to JavaScript in dist/
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run push` - Build and push to Google Apps Script
- `npm run deploy` - Create new deployment with timestamp
- `npm run release` - Push and deploy in one command
- `npm run test:local` - Run local test server with CSV data

## Project Structure

```
├── src/                    # Google Apps Script source files
│   ├── Code.ts            # Main API implementation with doGet()
│   └── appsscript.json    # GAS manifest configuration
├── scripts/               # Development tools (executed with tsx)
│   ├── deploy.ts          # Deployment automation
│   ├── localTestServer.ts # Local testing server
│   └── setup.ts           # Initial project setup
├── dist/                  # Compiled output (git-ignored)
└── data/                  # CSV test data (git-ignored)
```

## Architecture

The API provides these endpoints through the `doGet()` function:
- `/members` - Get all roster members with optional filters
- `/positions` - Get list of available positions

Query parameters:
- `position` - Filter by player position (WR, DB, RB, etc.)
- `fields` - Comma-separated list of fields to return
- `thumbnails=true` - Return thumbnail versions of images

Data flow:
1. CSV data from Google Sheets is parsed
2. Google Drive image URLs are converted to direct access URLs
3. Data is filtered and transformed based on query parameters
4. JSON response is returned with appropriate CORS headers

## Build System

- TypeScript compiles from `src/` to `dist/` directory
- Only `dist/` contents are uploaded to Google Apps Script
- ESLint v9 with flat config for code quality
- Scripts in `scripts/` are excluded from GAS compilation

## API Data Model

The Member interface includes:
- Personal info: name (Japanese/hiragana/alphabet), birthdate
- Team info: position, jersey number, role
- Physical: height, weight
- Media: photos (serious/casual)
- Personal: workplace, university, hobbies, favorites

## Key Considerations

- Google Apps Script environment - not Node.js
- Functions like `doGet` are global entry points
- No module system - all files share global scope
- Uses Google Sheets as data source
- Handles Japanese text (UTF-8)
- Converts Google Drive URLs for direct image access