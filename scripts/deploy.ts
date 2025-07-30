#!/usr/bin/env -S npx tsx

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function getExistingDeploymentId(): string | null {
  // Check environment variable first
  if (process.env.CLASP_DEPLOYMENT_ID) {
    return process.env.CLASP_DEPLOYMENT_ID.trim();
  }
  
  // Check .deploymentid file
  const deploymentIdFile = join(process.cwd(), '.deploymentid');
  if (existsSync(deploymentIdFile)) {
    try {
      const deploymentId = readFileSync(deploymentIdFile, 'utf8').trim();
      if (deploymentId) {
        return deploymentId;
      }
    } catch (error) {
      console.warn('Failed to read .deploymentid file:', (error as Error).message);
    }
  }
  
  return null;
}

function deploy(): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const description = `DEPLOY_${timestamp}`;
  
  try {
    const existingDeploymentId = getExistingDeploymentId();
    
    let output: string;
    if (existingDeploymentId) {
      console.log(`Updating existing deployment: ${existingDeploymentId}`);
      console.log(`Description: ${description}`);
      output = execSync(`npx clasp deploy --deploymentId "${existingDeploymentId}" --description "${description}"`, { 
        encoding: 'utf8',
        stdio: 'pipe' 
      });
    } else {
      console.log(`Creating new deployment: ${description}`);
      output = execSync(`npx clasp deploy --description "${description}"`, { 
        encoding: 'utf8',
        stdio: 'pipe' 
      });
    }
    
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