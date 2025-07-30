function doGet(ev: GoogleAppsScript.Events.DoGet = {} as GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  const sheet = SpreadsheetApp.getActiveSheet();
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({
    message: "hello",
    query: ev.parameter,
  }));
  return output;
}