import { PnpmLockfileV9Schema } from "@/pnpm/schema";
import { pnpmV9LockfileUrls } from "@es-vanguard/test-utilities/datasets/pnpm.ts";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import { describe, test, expect, beforeAll } from "bun:test";
import * as z from "zod";

beforeAll(async () => {
  await Promise.all(
    pnpmV9LockfileUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
  );
});

describe("pnpm lockfile v9 schema validation", () => {
  test.each(pnpmV9LockfileUrls)("should successfully parse %s", async (url) => {
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

    const validateYamlResult = PnpmLockfileV9Schema.safeParse(
      parseYamlResult.value
    );

    expect(validateYamlResult.success).toBe(true);

    if (!validateYamlResult.success) {
      console.error(`Schema validation failed for ${url} with error:`);
      console.error(z.prettifyError(validateYamlResult.error));
    }

    expect(validateYamlResult.data).toStrictEqual(parseYamlResult.value);
  });
});
