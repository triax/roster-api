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
    
    // Route to appropriate handler based on action parameter
    if (params.action === 'members' || !params.action) {
      const response = handleMembersRequest(params);
      return output.setContent(JSON.stringify(response));
    }
    
    if (params.action === 'positions') {
      const response = getAvailablePositions();
      return output.setContent(JSON.stringify(response));
    }
    
    // Invalid action
    const response = {
      success: false,
      error: 'Invalid action. Available actions: members, positions',
    };
    return output.setContent(JSON.stringify(response));
    
  } catch (error) {
    output.setContent(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    );
  }

  return output;
}