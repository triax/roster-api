// Utility functions

/**
 * Convert Google Drive sharing URLs to direct image URLs
 * @param driveUrl - The Google Drive URL to convert
 * @param useThumbnail - Whether to return thumbnail version
 * @returns Direct access URL
 */
function convertDriveUrlToDirectImageUrl(driveUrl: string, useThumbnail: boolean = false): string {
  if (!driveUrl) return '';

  // Match various Google Drive URL patterns
  const patterns = [
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = driveUrl.match(pattern);
    if (match && match[1]) {
      if (useThumbnail) {
        return `https://drive.google.com/thumbnail?id=${match[1]}`;
      } else {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
  }

  // If already a direct URL or doesn't match patterns, return as is
  return driveUrl;
}