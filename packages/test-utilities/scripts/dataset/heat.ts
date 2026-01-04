import { npmLockfileUrls } from "#datasets/npm.ts";
import { pnpmLockfileUrls } from "#datasets/pnpm.ts";
import { getGithubContent } from "#get-github-content.ts";

// A script to warm up dataset's local cache
console.log("Warming up dataset's local cache...");
const dataset = [...npmLockfileUrls, ...pnpmLockfileUrls];
await Promise.all(
  dataset.map((url) => getGithubContent({ githubBlobUrl: url }))
);
console.log("Done!");
