import { parsePnpmLockfile } from "@/pnpm";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";

const url =
  "https://github.com/browserslist/browserslist/blob/main/pnpm-lock.yaml";

const contentResult = await getGithubContent({ githubBlobUrl: url });
if (contentResult.isErr()) {
  throw new Error(
    `Test Setup Failed: Could not fetch ${url}. ${contentResult.error.message}`
  );
}

const parseResult = await parsePnpmLockfile(contentResult.value);
if (parseResult.isErr()) {
  console.error("Parse failed:", parseResult.error);
  process.exit(1);
}

const dependencies = parseResult.value;
console.log("Dependencies count:", Object.keys(dependencies).length);
console.log(
  "First few dependencies:",
  Object.entries(dependencies).slice(0, 5)
);
console.log("Sample dependency:", Object.entries(dependencies)[0]);
