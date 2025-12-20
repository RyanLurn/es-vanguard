/**
 * Transforms a GitHub Blob URL to a Raw URL and fetches the content.
 * Input: https://github.com/vercel/next.js/blob/canary/pnpm-lock.yaml
 * Output: Raw string content of the file
 */
async function fetchRemoteLockfile(githubBlobUrl: string): Promise<string> {
  // Convert "blob" URL to "raw" URL
  // Strategy: Replace 'github.com' -> 'raw.githubusercontent.com' and remove '/blob/'
  const rawUrl = githubBlobUrl
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");

  const response = await fetch(rawUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch remote lockfile: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

export { fetchRemoteLockfile };
