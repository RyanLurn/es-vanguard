import { safeJsonParse } from "@/index";
import { SchemaError } from "@standard-schema/utils";
import { expect, test, describe } from "bun:test";
import { npmLockfileUrls } from "@es-vanguard/test-utilities/datasets/npm.ts";
import { pnpmLockfileUrls } from "@es-vanguard/test-utilities/datasets/pnpm.ts";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import * as z from "zod";

const NpmLockfileSchema = z.object({
  name: z.string(),
  version: z.string(),
  lockfileVersion: z.number(),
  packages: z.record(z.string(), z.record(z.string(), z.any())),
});

const WrongNpmLockfileSchema = z.object({
  name: z.string(),
  version: z.string(),
  lockfileVersion: z.string(), // <--- Invalid schema, should be number
  packages: z.record(z.string(), z.record(z.string(), z.any())),
});

describe("Zod compliance", () => {
  // Group 1: Valid JSON Files (NPM)
  // We use describe.each because we want to run MULTIPLE tests for each URL
  describe.each(npmLockfileUrls)("File: %s", (url) => {
    test("Parse with valid schema (Success)", async () => {
      // 1. Fetch inside the test (Leverages cache)
      const contentResult = await getGithubContent({
        githubBlobUrl: url,
        enableLogging: false, // Keep logs clean
      });

      if (contentResult.isErr()) {
        throw contentResult.error;
      }
      const text = contentResult.value;

      // 2. Test Logic
      const result = await safeJsonParse({
        text,
        schema: NpmLockfileSchema,
      });

      expect(result.isOk()).toBe(true);
    });

    test("Parse with invalid schema (SchemaError)", async () => {
      const contentResult = await getGithubContent({
        githubBlobUrl: url,
        enableLogging: false,
      });

      if (contentResult.isErr()) {
        throw contentResult.error;
      }
      const text = contentResult.value;

      const result = await safeJsonParse({
        text,
        schema: WrongNpmLockfileSchema,
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(SchemaError);
      }
    });
  });

  // Group 2: Invalid JSON Files (PNPM - YAML)
  // We use test.each because we only have ONE test per URL
  test.each(pnpmLockfileUrls)(
    "Fails to parse non-JSON from %s",
    async (url) => {
      const contentResult = await getGithubContent({
        githubBlobUrl: url,
        enableLogging: false,
      });

      if (contentResult.isErr()) {
        throw contentResult.error;
      }
      const text = contentResult.value;

      const result = await safeJsonParse({
        text,
        schema: NpmLockfileSchema,
      });

      // Should fail at JSON.parse step
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(SyntaxError);
      }
    }
  );
});
