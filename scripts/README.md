# Scripts

This folder contains TypeScript scripts for development tasks that are too complex for npm scripts in package.json.

## Why TypeScript for scripts?

- **Type safety**: Same benefits as the main codebase - catch errors at development time
- **Consistency**: Entire project uses TypeScript, including development scripts
- **Better IDE support**: Full intellisense, autocompletion, and type checking
- **No build step**: Using `tsx` for direct TypeScript execution

## Why scripts instead of Makefile?

- **Cross-platform compatibility**: Works on Windows, Mac, and Linux without additional tools
- **TypeScript ecosystem**: Consistent with the rest of the project
- **Better error handling**: Full programming language features for complex logic

## Available scripts

- `setup.ts` - Validates project configuration and provides setup instructions
- `deploy.ts` - Creates deployments with better output formatting and URL extraction

## Running scripts

Scripts can be run in two ways:

1. Through npm scripts: `npm run setup`, `npm run deploy`
2. Directly with tsx: `npx tsx scripts/setup.ts`
3. As executables (with shebang): `./scripts/setup.ts`

## Adding new scripts

1. Create a new `.ts` file in this folder
2. Add the shebang: `#!/usr/bin/env -S npx tsx`
3. Make it executable: `chmod +x scripts/your-script.ts`
4. Add to package.json: `"your-command": "npx tsx scripts/your-script.ts"`