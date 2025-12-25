import { pnpmLockfileUrls } from "#constants.ts";
import { getGithubContent } from "#get-github-content.ts";

// A script to warm up the dataset local cache
for (const url of pnpmLockfileUrls) {
  console.log(`\nWarming up the cache for ${url}`);
  const getResult = await getGithubContent({
    githubBlobUrl: url,
    enableLogging: true,
  });
  if (getResult.isErr()) {
    console.error(getResult.error.message);
  }
}
