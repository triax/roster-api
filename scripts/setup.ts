#!/usr/bin/env -S npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ClaspConfig {
  scriptId: string;
  rootDir: string;
}

function setup(): void {
  console.log('Setting up Google Apps Script project...\n');
  
  // Check if .clasp.json exists
  const claspPath = path.join(__dirname, '..', '.clasp.json');
  
  if (!fs.existsSync(claspPath)) {
    console.error('Error: .clasp.json not found!');
    console.log('\nTo set up this project:');
    console.log('1. Run: npx clasp create --type standalone --title "Your Project Name"');
    console.log('   OR');
    console.log('2. Create .clasp.json manually with your existing script ID:');
    console.log('   {');
    console.log('     "scriptId": "YOUR_SCRIPT_ID_HERE",');
    console.log('     "rootDir": "."');
    console.log('   }');
    process.exit(1);
  }
  
  // Read and validate .clasp.json
  try {
    const claspConfig: ClaspConfig = JSON.parse(fs.readFileSync(claspPath, 'utf8'));
    if (!claspConfig.scriptId || claspConfig.scriptId === 'YOUR_SCRIPT_ID_HERE') {
      console.error('Error: Please update .clasp.json with your actual script ID');
      process.exit(1);
    }
    
    console.log('Found .clasp.json with script ID:', claspConfig.scriptId);
    console.log('\nProject is ready! Available commands:');
    console.log('  npm run build    - Compile TypeScript');
    console.log('  npm run push     - Push code to Google Apps Script');
    console.log('  npm run deploy   - Create a new deployment');
    console.log('  npm run release  - Push and deploy in one command');
    
  } catch (error) {
    console.error('Error reading .clasp.json:', (error as Error).message);
    process.exit(1);
  }
}

setup();