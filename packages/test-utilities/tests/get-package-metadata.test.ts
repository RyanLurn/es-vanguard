import { clearCache } from "./clear-cache";
import type { GetCachePathOptions } from "#get-cache-path.ts";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { getPackageMetadata } from "#npm/get-package-metadata.ts";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";

const rightCase: GetCachePathOptions = {
  url: "https://registry.npmjs.org/neverthrow",
  fileExtension: "json",
  prefix: "test",
};

const testCases: GetCachePathOptions[] = [rightCase];

beforeAll(async () => {
  await clearCache(testCases);
});

describe("getPackageMetadata function", () => {
  test("should fetch metadata for valid npm package", async () => {
    const result = await getPackageMetadata({
      packageName: "neverthrow" as NpmPackageName,
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    expect(result.value.name).toBe("neverthrow" as NpmPackageName);
  });
});

afterAll(async () => {
  await clearCache(testCases);
});
