import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { safeJsonParse } from "@es-vanguard/json-parser";
import * as z from "zod";

async function getNpmLockfileFixture() {
  const url = "https://github.com/npm/cli/blob/latest/package-lock.json";

  // 1. Fetch
  const contentResult = await getGithubContent({
    githubBlobUrl: url,
    enableLogging: false,
  });

  if (contentResult.isErr()) {
    throw new Error(`Failed to load fixture: ${contentResult.error.message}`);
  }

  // 2. Parse JSON
  const jsonResult = await safeJsonParse({
    text: contentResult.value,
    schema: z.record(z.string(), z.any()), // Loose schema just for loading
  });

  if (jsonResult.isErr()) {
    throw new Error(
      `Failed to parse fixture JSON: ${jsonResult.error.message}`
    );
  }

  return jsonResult.value;
}

export { getNpmLockfileFixture };
