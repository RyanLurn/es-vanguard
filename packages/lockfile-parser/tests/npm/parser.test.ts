import { describe, test, expect, beforeAll } from "bun:test";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { npmLockfileUrls } from "@es-vanguard/test-utilities/datasets/npm.ts";
import { parseNpmLockfile } from "@/npm";
import semver from "semver";

describe.concurrent("NPM Lockfile Parser Logic", () => {
  // Pre-warm the cache for all URLs to ensure tests run fast and concurrent
  beforeAll(async () => {
    await Promise.all(
      npmLockfileUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
    );
  });

  test.each(npmLockfileUrls)(
    "should correctly extract dependencies from %s",
    async (url) => {
      // 1. Setup
      const contentResult = await getGithubContent({ githubBlobUrl: url });
      if (contentResult.isErr()) {
        throw new Error(
          `Test Setup Failed: Could not fetch ${url}. ${contentResult.error.message}`
        );
      }

      // 2. Execute
      const parseResult = await parseNpmLockfile(contentResult.value);

      // 3. Assert Success
      if (parseResult.isErr()) {
        console.error(`Parser failed for ${url}:`, parseResult.error);
      }
      expect(parseResult.isOk()).toBe(true);

      const dependencies = parseResult._unsafeUnwrap();

      // 4. Assert Logic Constraints (The "Stress Test")

      // It should find *something* (unless the repo has literally 0 runtime deps)
      expect(dependencies.length).toBeGreaterThan(0);

      for (const dep of dependencies) {
        // Integrity Check: Name
        expect(dep.name).toBeTruthy();
        expect(typeof dep.name).toBe("string");

        // Logic Check: Version
        // The parser promises to filter out invalid semver (git deps, file deps).
        // If this fails, your filtering logic is too loose.
        expect(semver.valid(dep.version)).toBeTruthy();

        // Logic Check: Path
        // The parser promises to filter out workspace roots by checking for "node_modules/".
        // If this fails, you are accidentally including local workspace packages.
        expect(dep.path).toContain("node_modules/");
      }
    }
  );
});
