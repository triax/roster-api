# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Apps Script project that provides a REST API for interacting with Google Sheets data. The project uses CLASP (Command Line Apps Script Projects) for development and deployment, with TypeScript support for better type safety.

## Development Commands

- `npm run build` - Compile TypeScript files to JavaScript
- `npm run push` - Build and push local changes to Google Apps Script
- `npm run deploy` - Create a new deployment with timestamp
- `npm run archive` - Create a new version with timestamp
- `npm run release` - Push and deploy in one command (equivalent to `npm run push && npm run deploy`)

## Architecture

The project follows a simple Google Apps Script structure with TypeScript support:
- `Code.ts` - TypeScript source file containing the `doGet()` function that handles HTTP GET requests
- `Code.js` - Compiled JavaScript output (auto-generated from TypeScript, ignored in Git)
- `appsscript.json` - Google Apps Script manifest file specifying runtime settings and webapp configuration
- `.clasp.json` - CLASP configuration linking to the Google Apps Script project
- `tsconfig.json` - TypeScript configuration for Google Apps Script environment

The API currently returns JSON responses with query parameters from the request.

## TypeScript Development

- Write code in `Code.ts` (or any `.ts` file)
- CLASP v3.0.6+ no longer automatically compiles TypeScript - manual build step required
- Run `npm run build` to compile TypeScript before pushing
- Type definitions are provided by `@types/google-apps-script` (v1.0.99)
- The TypeScript target is ES2019 to match the V8 runtime

## Web App Configuration

The app is configured as a web app with the following settings (in `appsscript.json`):
- Execute as: USER_DEPLOYING
- Access: ANYONE_ANONYMOUS (publicly accessible without authentication)
- Time zone: Asia/Tokyo

## Key Considerations

- This is a Google Apps Script project, not a Node.js project - the package.json is only for CLASP and TypeScript tooling
- The script runs in Google's cloud environment with access to Google Workspace APIs
- TypeScript must be compiled to JavaScript before pushing (handled by `npm run push`)
- The script is configured to use the V8 JavaScript runtime and logs to Stackdriver
- Only edit `.ts` files - `.js` files are auto-generated and should not be edited directly

## Deployment Management

- Google Apps Script deployment IDs always start with the prefix `AKfycb` followed by random alphanumeric characters
- Each deployment creates a new unique URL endpoint
- Run `npm run deploy` to create a new deployment
- The deployment URL will be displayed in the console output after successful deployment