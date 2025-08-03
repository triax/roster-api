import { getTargetFileID, getCSVContent } from './src/target';
import { convertCSVToJSON } from './src/convert';
import { saveRosterToFile } from './src/save';

async function main() {
  const target = getTargetFileID();
  const content = await getCSVContent(target);
  const roster = convertCSVToJSON(content.data.toString());
  const filename = await saveRosterToFile(roster);
  console.log(`Roster saved to ${filename}`);
}

main().catch(console.error);
