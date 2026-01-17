import { findDistObjects } from "#components/find-dist-objects";
import { getPackageMetadata } from "#components/get-package-metadata";
import type { PackageMetadata } from "#utils/get-metadata";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";
import { describe, test, expect, beforeAll } from "bun:test";

let reactMetadata: PackageMetadata;

beforeAll(async () => {
  const getReactMetadataResult = await getPackageMetadata({
    packageName: "react" as NpmPackageName,
  });

  if (getReactMetadataResult.isErr()) {
    throw getReactMetadataResult.error;
  }

  reactMetadata = getReactMetadataResult.value;
});

describe("Find dist objects component", () => {
  test("should find dist objects for react", () => {
    const findDistObjectsResult = findDistObjects({
      name: "react" as NpmPackageName,
      target: "19.2.3" as Semver,
      base: "previous",
      packageMetadata: reactMetadata,
    });

    expect(findDistObjectsResult.isOk()).toBe(true);
  });

  test("should not find dist objects for invalid versions", () => {
    const findDistObjectsResult = findDistObjects({
      name: "react" as NpmPackageName,
      target: "999.999.999" as Semver,
      base: "previous",
      packageMetadata: reactMetadata,
    });

    expect(findDistObjectsResult.isErr()).toBe(true);

    if (findDistObjectsResult.isErr()) {
      expect(findDistObjectsResult.error.version).toBe("target");
    }
  });
});
