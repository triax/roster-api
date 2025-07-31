// Google Sheets data operations

/**
 * Fetch all member data from the spreadsheet
 * @param useThumbnails - Whether to use thumbnail URLs for images
 * @returns Array of Member objects
 */
function fetchRosterData(useThumbnails: boolean = false): Member[] {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    throw new Error('No data found in spreadsheet');
  }

  // Skip header row and process data
  const members: Member[] = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Skip empty rows
    if (!row[0] || !row[1]) continue;

    members.push({
      timestamp: row[0] ? new Date(row[0]).toISOString() : '',
      name: {
        default: row[1] || '',
        hiragana: row[2] || '',
        alphabet: row[3] || '',
      },
      position: row[4] || '',
      jersey: row[5] ? row[5].toString() : undefined,
      height: row[6] ? row[6].toString() : undefined,
      weight: row[7] ? row[7].toString() : undefined,
      birthdate: row[8] ? new Date(row[8]).toISOString().split('T')[0] : undefined,
      next_introduction: row[9] || undefined,
      role: row[10] || '',
      photos: {
        serious: convertDriveUrlToDirectImageUrl(row[11] || '', useThumbnails),
        casual: row[12]
          ? row[12]
              .split(',')
              .map((url: string) => convertDriveUrlToDirectImageUrl(url.trim(), useThumbnails))
              .filter((url: string) => url)
          : [],
      },
      workplace: row[13] || '',
      university: row[14] || '',
      enthusiasm: row[15] || '',
      watchme: row[16] || '',
      hobbies: row[17] || '',
      favorite: row[18] || '',
      gifts: row[19] || '',
      what_i_like_about_triax: row[20] || '',
    });
  }

  return members;
}