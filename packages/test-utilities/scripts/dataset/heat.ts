import { pnpmLockfileUrls } from "#constants.ts";
import { getGithubContent } from "#get-github-content.ts";

// A script to warm up the dataset local cache
for (const url of pnpmLockfileUrls) {
  console.log(`[INFO] Warming up the cache for ${url}`);
  const getResult = await getGithubContent({
    githubBlobUrl: url,
  });
  if (getResult.isErr()) {
    console.error(
      `[ERROR] Failed to warm up the cache for ${url}: ${getResult.error.message}`
    );
  }
}
