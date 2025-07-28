# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Apps Script project that provides a REST API for interacting with Google Sheets data. The project uses CLASP (Command Line Apps Script Projects) for development and deployment.

## Development Commands

- `npm run push` - Push local changes to Google Apps Script
- `npm run deploy` - Create a new deployment with timestamp
- `npm run archive` - Create a new version with timestamp
- `npm run release` - Push and deploy in one command (equivalent to `npm run push && npm run deploy`)

## Architecture

The project follows a simple Google Apps Script structure:
- `Code.js` - Main entry point containing the `doGet()` function that handles HTTP GET requests
- `appsscript.json` - Google Apps Script manifest file specifying runtime settings
- `.clasp.json` - CLASP configuration linking to the Google Apps Script project

The API currently returns JSON responses with information about the active spreadsheet's dimensions (rows and columns).

## Key Considerations

- This is a Google Apps Script project, not a Node.js project - the package.json is only for CLASP tooling
- The script runs in Google's cloud environment with access to Google Workspace APIs
- Changes must be pushed to Google Apps Script using CLASP before they take effect
- The script is configured to use the V8 JavaScript runtime and logs to Stackdriver