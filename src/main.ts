// Main entry point for Google Apps Script

/**
 * Entry point for HTTP GET requests
 * @param ev - The event object from Google Apps Script
 * @returns TextOutput with JSON response
 */
function doGet(
  ev: GoogleAppsScript.Events.DoGet = {} as GoogleAppsScript.Events.DoGet
): GoogleAppsScript.Content.TextOutput {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  try {
    const params = ev.parameter || {};
    const response = routes(params.action as string, params);
    return output.setContent(JSON.stringify(response));
  } catch (error) {
    const response = {
      success: false,
      code: 500,
      error: error instanceof Error ? error.message : String(error),
    };
    return output.setContent(JSON.stringify(response));
  }
}