import { clearCache } from "./clear-cache";
import type { GetCachePathOptions } from "#get-cache-path.ts";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { getPackageMetadata } from "#npm/get-package-metadata.ts";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import { NPM_REGISTRY_URL } from "@es-vanguard/utils/npm-constants";

const packageName = "neverthrow" as NpmPackageName;

const rightCase: GetCachePathOptions = {
  url: `${NPM_REGISTRY_URL}/${packageName}`,
  fileExtension: "json",
  prefix: "test",
};

const testCases: GetCachePathOptions[] = [rightCase];

beforeAll(async () => {
  await clearCache(testCases);
});

describe("getPackageMetadata function", () => {
  test("should get metadata for valid npm package", async () => {
    const result = await getPackageMetadata({
      packageName,
      prefix: rightCase.prefix,
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    expect(result.value.name).toBe(packageName);
  });
});

afterAll(async () => {
  await clearCache(testCases);
});
