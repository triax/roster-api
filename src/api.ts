// API request handlers

/**
 * Handle requests for member data
 * @param params - Query parameters from the request
 * @returns API response with filtered member data
 */
function handleMembersRequest(params: Record<string, string>): APIResponse<Member[]> {
  const useThumbnails = params.thumbnails === 'true';
  const members = fetchRosterData(useThumbnails);
  let filteredMembers = members;

  // Filter by position if specified
  if (params.position) {
    filteredMembers = members.filter(
      (m) => m.position.toLowerCase() === params.position.toLowerCase()
    );
  }

  // Filter by jersey number if specified
  if (params.jerseyNumber) {
    filteredMembers = members.filter((m) => m.jersey === params.jerseyNumber);
  }

  // Search by name if specified
  if (params.name) {
    const searchTerm = params.name.toLowerCase();
    filteredMembers = members.filter(
      (m) =>
        m.name.default.toLowerCase().includes(searchTerm) ||
        m.name.hiragana.toLowerCase().includes(searchTerm) ||
        m.name.alphabet.toLowerCase().includes(searchTerm)
    );
  }

  // Limit fields if specified
  if (params.fields) {
    const fields = params.fields.split(',');
    filteredMembers = filteredMembers.map((member) => {
      const limitedMember: Record<string, unknown> = {};
      fields.forEach((field: string) => {
        if (field in member) {
          limitedMember[field] = member[field as keyof Member];
        }
      });
      return limitedMember as unknown as Member;
    });
  }

  return {
    success: true,
    code: 200,
    data: filteredMembers,
    count: filteredMembers.length,
  };
}

/**
 * Get list of available positions
 * @returns API response with sorted list of positions
 */
function getAvailablePositions(): APIResponse<string[]> {
  const members = fetchRosterData(false);
  const positions = new Set(members.map((m) => m.position).filter((p) => p));

  return {
    success: true,
    code: 200,
    data: Array.from(positions).sort(),
  };
}