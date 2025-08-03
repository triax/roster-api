import { getTargetFileID, getCSVContent } from './src/target';
import { convertCSVToJSON } from './src/convert';
import { saveRosterToFile } from './src/save';

async function main() {
  const target = getTargetFileID();
  const content = await getCSVContent(target);
  const roster = convertCSVToJSON(content.data.toString());
  const filename = await saveRosterToFile(roster);
  console.log(`Roster saved to ${filename}`);
  const args = process.argv.slice(2);
  if (args.includes('--dump')) {
    console.log('Dumping roster to console:');
    console.log(JSON.stringify(roster, null, 2));
  }
  return filename;
}

main().catch(console.error);
