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
│   ├── main.ts            # Entry point with doGet() function
│   ├── api.ts             # API request handlers
│   ├── sheets.ts          # Google Sheets data operations
│   ├── utils.ts           # Utility functions (URL conversion)
│   ├── types.ts           # TypeScript interface definitions
│   └── appsscript.json    # GAS manifest configuration
├── scripts/               # Development tools (executed with tsx)
│   ├── deploy.ts          # Deployment automation
│   ├── localTestServer.ts # Local testing server
│   └── setup.ts           # Initial project setup
├── dist/                  # Compiled output (git-ignored)
└── data/                  # CSV test data (git-ignored)
```

## Architecture

The codebase follows a modular architecture with clear separation of concerns:

1. **main.ts** - Entry point with `doGet()` function that routes requests
2. **api.ts** - Handles `/members` and `/positions` endpoints
3. **sheets.ts** - Fetches and parses data from Google Sheets
4. **utils.ts** - Converts Google Drive URLs for direct access
5. **types.ts** - Defines Member interface and response types

API endpoints:
- `/?action=members` (or no action) - Get roster members
- `/?action=positions` - Get list of available positions

Query parameters:
- `position` - Filter by player position (WR, DB, RB, etc.)
- `fields` - Comma-separated list of fields to return
- `thumbnails=true` - Return thumbnail versions of images
- `jerseyNumber` - Filter by jersey number
- `name` - Search by name (Japanese/alphabet)

Data flow:
1. CSV data from Google Sheets is parsed
2. Google Drive image URLs are converted to direct access URLs
3. Data is filtered and transformed based on query parameters
4. JSON response is returned with appropriate CORS headers

## Build System

- TypeScript compiles from `src/` to `dist/` directory with target ES2019
- Only `dist/` contents are uploaded to Google Apps Script
- ESLint v9 with flat config for code quality
- Scripts in `scripts/` are excluded from GAS compilation
- No module system - all files share global scope (GAS limitation)

## API Data Model

The Member interface includes:
- Personal info: name (Japanese/hiragana/alphabet), birthdate
- Team info: position, jersey number, role
- Physical: height, weight
- Media: photos (serious/casual) with Google Drive integration
- Personal: workplace, university, hobbies, favorites

Response format:
```typescript
{
  success: boolean;
  data?: Member[] | string[];
  error?: string;
}
```

## Local Development

The project includes a local test server that mimics the production API:
- Uses Express.js to simulate Google Apps Script endpoints
- Reads from CSV file instead of Google Sheets
- Same endpoints, filtering, and response format as production
- Supports Japanese text (UTF-8)

## Key Considerations

- Google Apps Script environment - not Node.js
- Functions like `doGet` are global entry points
- No module system - all files share global scope
- Uses Google Sheets as data source
- Handles Japanese text (UTF-8)
- Converts Google Drive URLs for direct image access
- Deployment tracking via `.deployment.json`
- Automated deployment with timestamp versioning