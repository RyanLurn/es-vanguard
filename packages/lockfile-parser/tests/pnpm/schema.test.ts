import {
  pnpmLockfileUrls,
  pnpmV5LockfileUrls,
  pnpmV6LockfileUrls,
  pnpmV9LockfileUrls,
} from "@es-vanguard/test-utilities/datasets/pnpm.ts";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { describe, test, expect, beforeAll } from "bun:test";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import { PnpmLockfileFileSchema } from "@/pnpm/schemas/lockfile-file";
import { SchemaError } from "@standard-schema/utils";
import * as z from "zod";

beforeAll(async () => {
  await Promise.all(
    pnpmLockfileUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
  );
});

describe("pnpm lockfile schema validation", () => {
  test.each(pnpmV5LockfileUrls)(
    "should fail to parse v5 lockfile at %s",
    async (url) => {
      const result = await getGithubContent({ githubBlobUrl: url });
      if (result.isErr()) {
        throw new Error(`Failed to fetch ${url}: ${result.error.message}`);
      }

      const parseYamlResult = await safeYamlParse({
        text: result.value,
        schema: PnpmLockfileFileSchema,
      });

      expect(parseYamlResult.isErr()).toBe(true);

      if (parseYamlResult.isErr()) {
        const error = parseYamlResult.error;
        expect(error instanceof SchemaError).toBe(true);
      }
    }
  );

  test.each(pnpmV6LockfileUrls)(
    "should successfully parse v6 lockfile at %s",
    async (url) => {
      const result = await getGithubContent({ githubBlobUrl: url });
      if (result.isErr()) {
        throw new Error(`Failed to fetch ${url}: ${result.error.message}`);
      }

      const parseYamlResult = await safeYamlParse({
        text: result.value,
        schema: z.any(),
      });

      if (parseYamlResult.isErr()) {
        throw new Error(
          `Failed to parse ${url}: ${parseYamlResult.error.message}`
        );
      }

      const validateYamlResult = PnpmLockfileFileSchema.safeParse(
        parseYamlResult.value
      );

      expect(validateYamlResult.success).toBe(true);

      if (!validateYamlResult.success) {
        console.error(`Schema validation failed for ${url} with error:`);
        console.error(z.prettifyError(validateYamlResult.error));
      }
    }
  );

  test.each(pnpmV9LockfileUrls)(
    "should successfully parse v9 lockfile at %s",
    async (url) => {
      const result = await getGithubContent({ githubBlobUrl: url });
      if (result.isErr()) {
        throw new Error(`Failed to fetch ${url}: ${result.error.message}`);
      }

      const parseYamlResult = await safeYamlParse({
        text: result.value,
        schema: z.any(),
      });

      if (parseYamlResult.isErr()) {
        throw new Error(
          `Failed to parse ${url}: ${parseYamlResult.error.message}`
        );
      }

      const validateYamlResult = PnpmLockfileFileSchema.safeParse(
        parseYamlResult.value
      );

      expect(validateYamlResult.success).toBe(true);

      if (!validateYamlResult.success) {
        console.error(`Schema validation failed for ${url} with error:`);
        console.error(z.prettifyError(validateYamlResult.error));
      }

      expect(validateYamlResult.data).toStrictEqual(parseYamlResult.value);
    }
  );
});
