
function routes(action: string, params: Record<string, any>): APIResponse<unknown> {
  switch (action) {
    case 'members':
      return handleMembersRequest(params);
    case 'positions':
      return getAvailablePositions();
    default:
      return {
        success: false,
        code: 404,
        error: 'Invalid action. Available actions: members, positions',
      };
  }
}