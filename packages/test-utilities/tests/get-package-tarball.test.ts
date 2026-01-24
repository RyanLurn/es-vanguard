import type { GetCachePathOptions } from "#get-cache-path.ts";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { clearCache } from "./clear-cache";
import { getPackageTarball } from "#npm/get-package-tarball.ts";
import { NPM_REGISTRY_URL } from "@es-vanguard/utils/npm-constants";

const packageName = "zod" as NpmPackageName;
const version = "4.3.6" as Semver;
const prefix = "test";

const metadata: GetCachePathOptions = {
  url: `${NPM_REGISTRY_URL}/${packageName}`,
  fileExtension: "json",
  prefix,
};
const tarball: GetCachePathOptions = {
  url: `${NPM_REGISTRY_URL}/${packageName}/-/${packageName}-${version}.tgz`,
  fileExtension: "tar.gz",
  prefix,
};

const caches: GetCachePathOptions[] = [metadata, tarball];

beforeAll(async () => {
  await clearCache(caches);
});

describe("getPackageTarball function", () => {
  test("should get tarball for valid npm package", async () => {
    const result = await getPackageTarball({
      packageName,
      version,
      prefix,
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    const tarball = result.value;
    expect(tarball).toBeInstanceOf(Blob);

    const archive = new Bun.Archive(tarball);
    expect(archive).toBeDefined();

    const files = await archive.files();
    expect(files).toBeDefined();
    expect(files.size).toBeGreaterThan(0);

    const packageJSON = files.get("package/package.json");
    expect(packageJSON).toBeDefined();

    if (!packageJSON) {
      throw new Error("package.json not found in archive");
    }

    const packageJSONContent = JSON.parse(await packageJSON.text());
    expect(packageJSONContent).toBeInstanceOf(Object);
    expect(packageJSONContent.name).toBe(packageName);
    expect(packageJSONContent.version).toBe(version);
  });
});

afterAll(async () => {
  await clearCache(caches);
});
