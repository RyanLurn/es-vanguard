import { SchemaError } from "@standard-schema/utils";
import { expect, test, describe } from "bun:test";
import {
  npmLockfileUrls,
  pnpmLockfileUrls,
} from "@es-vanguard/test-utilities/constants";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { PnpmLockfileZodSchema } from "tests/helpers/zod-schemas";
import { safeYamlParse } from "@/index";
import * as z from "zod";

describe("Zod compliance", () => {
  // 1. Valid PNPM Lockfiles -> OK
  describe.each(pnpmLockfileUrls)("File: %s", (url) => {
    test("Parse with valid schema (Success)", async () => {
      // Fetch inside the test (Leverages cache)
      const contentResult = await getGithubContent({
        githubBlobUrl: url,
        enableLogging: false, // Keep logs clean
      });

      if (contentResult.isErr()) {
        throw contentResult.error;
      }
      const text = contentResult.value;

      // Test Logic
      const result = await safeYamlParse({
        text,
        schema: PnpmLockfileZodSchema,
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

      const result = await safeYamlParse({
        text,
        schema: z.number(),
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(SchemaError);
      }
    });
  });

  // 2. Valid JSON Files (NPM) -> Parse OK, Validation Fail (SchemaError)
  // JSON is valid YAML (1.2), so it won't throw SyntaxError!
  test.each(npmLockfileUrls)(
    "Parses JSON as YAML but fails validation for %s",
    async (url) => {
      const contentResult = await getGithubContent({
        githubBlobUrl: url,
        enableLogging: false,
      });
      if (contentResult.isErr()) {
        throw contentResult.error;
      }
      const text = contentResult.value;

      const result = await safeYamlParse({
        text,
        schema: PnpmLockfileZodSchema,
      });

      // It should parse successfully (JSON is YAML), but fail schema validation
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(SchemaError);
      }
    }
  );

  // 3. Actual Invalid Syntax -> SyntaxError
  test("Fails to parse malformed YAML", async () => {
    const brokenYaml = `
    name: test
      indentation_error: true
    oops: [ unclosed array
    `;

    const result = await safeYamlParse({
      text: brokenYaml,
      schema: PnpmLockfileZodSchema,
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(SyntaxError);
    }
  });
});
