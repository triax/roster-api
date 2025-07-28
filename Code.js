
function doGet(ev = {}) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getDataRange();
  Logger.log(range.getNumColumns());
  Logger.log(range.getNumRows());
  Logger.log("Hello, world!");
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({
    message: "Hello, world! This is a Google Apps Script.",
    columns: range.getNumColumns(),
    rows: range.getNumRows(),
  }));
  return output;
}
