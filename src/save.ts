import fs from 'fs/promises';
import path from 'path';
import { type RosterJSON } from './types';

const projectRoot = path.resolve(__dirname, '..');

/**
 * Save the roster JSON to a file
 * If exists, overwrite the file
 * @param roster - The roster data to save
 * @param filename - The name of the file to save the roster to
 * @returns The path to the saved file
 */
export async function saveRosterToFile(roster: RosterJSON, filename: string = 'roster.json'): Promise<string> {
  const filePath = path.join(projectRoot, 'data', filename);
  await fs.writeFile(filePath, JSON.stringify(roster, null, 2));
  return filePath;
}
