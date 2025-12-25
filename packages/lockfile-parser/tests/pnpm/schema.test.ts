import {
  pnpmV5LockfileUrls,
  pnpmV6LockfileUrls,
  pnpmV9LockfileUrls,
} from "@es-vanguard/test-utilities/constants";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { describe, test, expect, beforeAll } from "bun:test";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import { PnpmLockfileFileSchema } from "@/pnpm/schemas/lockfile-file";
import { SchemaError } from "@standard-schema/utils";
import * as z from "zod";

describe("PNPM Lockfile v5 Schema Validation", () => {
  beforeAll(async () => {
    await Promise.all(
      pnpmV5LockfileUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
    );
  });

  test.each(pnpmV5LockfileUrls)("should fail to parse %s", async (url) => {
    const result = await getGithubContent({ githubBlobUrl: url });
    if (result.isErr()) {
      throw new Error(`Failed to fetch ${url}: ${result.error.message}`);
    }

    const parseYamlResult = await safeYamlParse({
      text: result.value,
      schema: PnpmLockfileFileSchema,
    });

    expect(parseYamlResult.isOk()).toBe(false);

    if (parseYamlResult.isErr()) {
      const error = parseYamlResult.error;
      expect(error instanceof SchemaError).toBe(true);
    }
  });
});

describe("PNPM Lockfile v6 Schema Validation", () => {
  beforeAll(async () => {
    await Promise.all(
      pnpmV6LockfileUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
    );
  });

  test.each(pnpmV6LockfileUrls)("should successfully parse %s", async (url) => {
    const result = await getGithubContent({ githubBlobUrl: url });
    if (result.isErr()) {
      throw new Error(`Failed to fetch ${url}: ${result.error.message}`);
    }

    const parseYamlResult = await safeYamlParse({
      text: result.value,
      schema: PnpmLockfileFileSchema,
    });

    if (parseYamlResult.isErr()) {
      console.error(`Schema validation failed for ${url}`);

      const error = parseYamlResult.error;

      if (error instanceof SchemaError) {
        console.error("SchemaError:", z.prettifyError(error));
      } else {
        console.error(error);
      }
    }

    expect(parseYamlResult.isOk()).toBe(true);
  });
});

describe("PNPM Lockfile v9 Schema Validation", () => {
  beforeAll(async () => {
    await Promise.all(
      pnpmV9LockfileUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
    );
  });

  test.each(pnpmV9LockfileUrls)("should successfully parse %s", async (url) => {
    const result = await getGithubContent({ githubBlobUrl: url });
    if (result.isErr()) {
      throw new Error(`Failed to fetch ${url}: ${result.error.message}`);
    }

    const parseYamlResult = await safeYamlParse({
      text: result.value,
      schema: PnpmLockfileFileSchema,
    });

    if (parseYamlResult.isErr()) {
      console.error(`Schema validation failed for ${url}`);

      const error = parseYamlResult.error;

      if (error instanceof SchemaError) {
        console.error("SchemaError:", z.prettifyError(error));
      } else {
        console.error(error);
      }
    }

    expect(parseYamlResult.isOk()).toBe(true);
  });
});
