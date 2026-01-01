import { describe, test, expect, beforeAll } from "bun:test";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { parsePnpmLockfile } from "@/pnpm";
import semver from "semver";
import { pnpmV9LockfileUrls } from "@es-vanguard/test-utilities/datasets/pnpm.ts";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import { PnpmLockfileV9Schema } from "@/pnpm/schema";

describe("pnpm lockfile parser logic", () => {
  // Pre-warm the cache for all URLs to ensure tests run fast and concurrent
  beforeAll(async () => {
    await Promise.all(
      pnpmV9LockfileUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
    );
  });

  test.each(pnpmV9LockfileUrls)(
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
      const parseResult = await parsePnpmLockfile(contentResult.value);

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
        if (semver.valid(dep.version) === null) {
          console.error(
            `Invalid version found: ${dep.version} for package ${dep.name} at url ${url}`
          );
        }
        expect(semver.valid(dep.version)).toBeTruthy();
      }

      // It should parse all dependencies inside snapshots
      const lockfileYamlParseResult = await safeYamlParse({
        text: contentResult.value,
        schema: PnpmLockfileV9Schema,
      });

      if (lockfileYamlParseResult.isErr()) {
        console.error(
          `Yaml parse failed for ${url}:`,
          lockfileYamlParseResult.error
        );
      }

      const lockfileYaml = lockfileYamlParseResult._unsafeUnwrap();

      const numbersOfSnapshots = Object.keys(lockfileYaml.snapshots).length;
      expect(dependencies.length).toBe(numbersOfSnapshots);
    }
  );
});
