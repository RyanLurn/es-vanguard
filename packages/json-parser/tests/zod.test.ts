import { safeJsonParse } from "@/index";
import { SchemaError } from "@standard-schema/utils";
import { expect, test, describe } from "bun:test";
import {
  npmLockfileUrls,
  pnpmLockfileUrls,
} from "@es-vanguard/test-utilities/constants";
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

describe("Zod compliance", async () => {
  for (const url of npmLockfileUrls) {
    const getContentResult = await getGithubContent({
      githubBlobUrl: url,
      enableLogging: true,
    });

    if (getContentResult.isErr()) {
      throw getContentResult.error;
    }
    const lockfileText = getContentResult.value;

    test(`Parse valid json content from ${url} with valid schema`, async () => {
      const parsedJsonResult = await safeJsonParse({
        text: lockfileText,
        schema: NpmLockfileSchema,
        enableLogging: true,
      });

      expect(parsedJsonResult.isOk()).toBe(true);
    });

    test(`Parse valid json content from ${url} with invalid schema`, async () => {
      const parsedJsonResult = await safeJsonParse({
        text: lockfileText,
        schema: WrongNpmLockfileSchema,
      });

      expect(parsedJsonResult.isErr()).toBe(true);

      if (parsedJsonResult.isErr()) {
        expect(parsedJsonResult.error instanceof SchemaError).toBe(true);
      }
    });
  }

  for (const url of pnpmLockfileUrls) {
    const getContentResult = await getGithubContent({
      githubBlobUrl: url,
      enableLogging: true,
    });

    if (getContentResult.isErr()) {
      throw getContentResult.error;
    }
    const lockfileText = getContentResult.value;

    test(`Parse invalid json content from ${url}`, async () => {
      const parsedJsonResult = await safeJsonParse({
        text: lockfileText,
        schema: NpmLockfileSchema,
      });

      expect(parsedJsonResult.isErr()).toBe(true);

      if (parsedJsonResult.isErr()) {
        expect(parsedJsonResult.error instanceof SyntaxError).toBe(true);
      }
    });
  }
});
