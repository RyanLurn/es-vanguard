import { getPackageMetadata } from "#components/get-package-metadata";
import { BetterFetchError } from "@better-fetch/fetch";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import { describe, test, expect } from "bun:test";

describe("Get package metadata component", () => {
  test("should fetch metadata for react", async () => {
    const getReactMetadataResult = await getPackageMetadata({
      packageName: "react" as NpmPackageName,
    });
    expect(getReactMetadataResult.isOk()).toBe(true);
  });

  test("should throw error with status 404 for non-existent package", async () => {
    const getNonExistentPackageMetadataResult = await getPackageMetadata({
      packageName: "non-existent-package" as NpmPackageName,
    });
    expect(getNonExistentPackageMetadataResult.isErr()).toBe(true);

    if (getNonExistentPackageMetadataResult.isErr()) {
      const error = getNonExistentPackageMetadataResult.error;
      expect(error).toBeInstanceOf(BetterFetchError);

      if (error instanceof BetterFetchError) {
        expect(error.status).toBe(404);
      }
    }
  });
});
