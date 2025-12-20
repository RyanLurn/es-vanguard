import { safeJsonParse } from "@/index";
import { SchemaError } from "@standard-schema/utils";
import { expect, test, describe } from "bun:test";
import { githubBlobJsonUrls, githubBlobNotJsonUrls } from "tests/constants";
import { fetchRemoteLockfile } from "tests/helpers";
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
  for (const url of githubBlobJsonUrls) {
    const lockfileText = await fetchRemoteLockfile(url, true);

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

  for (const url of githubBlobNotJsonUrls) {
    const lockfileText = await fetchRemoteLockfile(url, true);

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
