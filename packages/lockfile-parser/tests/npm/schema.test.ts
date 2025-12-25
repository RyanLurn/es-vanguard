import { describe, test, expect, beforeAll } from "bun:test";
import { expectTypeOf } from "bun:test";
import * as z from "zod";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import {
  npmLockfileUrls,
  npmV1LockfileUrls,
} from "@es-vanguard/test-utilities/constants";
import { NpmLockfileSchema, type NpmLockfile } from "@/npm/schema";

// We use describe.concurrent to run these suites in parallel
describe.concurrent("NPM Lockfile Schema Validation", () => {
  // Pre-fetch all content to ensure cache is warm and tests are CPU-bound
  beforeAll(async () => {
    const allUrls = [...npmLockfileUrls, ...npmV1LockfileUrls];
    await Promise.all(
      allUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
    );
  });

  describe("Valid Lockfiles (v2 & v3)", () => {
    test.each(npmLockfileUrls)("should successfully parse %s", async (url) => {
      const result = await getGithubContent({ githubBlobUrl: url });
      if (result.isErr()) {
        throw new Error(`Failed to fetch ${url}: ${result.error.message}`);
      }

      const json = JSON.parse(result.value);
      const parseResult = NpmLockfileSchema.safeParse(json);

      if (!parseResult.success) {
        // Zod 4: Use prettifyError for clean debugging output if a test fails
        console.error(`Schema validation failed for ${url}`);
        console.error(z.prettifyError(parseResult.error));
      }

      expect(parseResult.success).toBe(true);

      if (parseResult.success) {
        // Compile-time type check to ensure our Zod inference matches TypeScript expectations
        expectTypeOf(parseResult.data).toEqualTypeOf<NpmLockfile>();

        // Logic check: Ensure we actually have packages
        expect(Object.keys(parseResult.data.packages).length).toBeGreaterThan(
          0
        );
      }
    });
  });

  describe("Invalid Lockfiles (v1)", () => {
    test.each(npmV1LockfileUrls)(
      "should reject legacy v1 lockfile %s",
      async (url) => {
        const result = await getGithubContent({ githubBlobUrl: url });
        if (result.isErr()) {
          throw new Error(`Failed to fetch ${url}: ${result.error.message}`);
        }

        const json = JSON.parse(result.value);
        const parseResult = NpmLockfileSchema.safeParse(json);

        expect(parseResult.success).toBe(false);

        if (!parseResult.success) {
          // Verify it failed specifically on the version gate or missing 'packages'
          // Zod 4: 'issues' is the public array on ZodError
          const hasVersionError = parseResult.error.issues.some(
            (issue) =>
              issue.path.includes("lockfileVersion") ||
              issue.path.includes("packages")
          );
          expect(hasVersionError).toBe(true);
        }
      }
    );
  });
});
