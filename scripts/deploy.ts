#!/usr/bin/env -S npx tsx

import { execSync } from 'child_process';

function deploy(): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const description = `DEPLOY_${timestamp}`;
  
  try {
    console.log(`Creating deployment: ${description}`);
    const output = execSync(`npx clasp deploy --description "${description}"`, { 
      encoding: 'utf8',
      stdio: 'pipe' 
    });
    
    console.log(output);
    
    // Extract deployment URL from output
    const urlMatch = output.match(/(https:\/\/script\.google\.com\/[^\s]+)/);
    if (urlMatch) {
      console.log(`\nDeployment URL: ${urlMatch[1]}`);
    }
  } catch (error) {
    console.error('Deployment failed:', (error as Error).message);
    process.exit(1);
  }
}

deploy();