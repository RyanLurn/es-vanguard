import { getResource } from "#get-resource.ts";
import { beforeAll, describe, test, expect, afterAll } from "bun:test";
import { clearCache } from "./clear-cache";
import type { GetCachePathOptions } from "#get-cache-path.ts";

const jsonCase: GetCachePathOptions = {
  url: "https://registry.npmjs.org/ofetch/1.5.1",
  fileExtension: "json",
  prefix: "test",
};
const yamlCase: GetCachePathOptions = {
  url: "https://raw.githubusercontent.com/unjs/ofetch/main/pnpm-lock.yaml",
  fileExtension: "yaml",
  prefix: "test",
};
const tarballCase: GetCachePathOptions = {
  url: "https://registry.npmjs.org/ofetch/-/ofetch-1.5.1.tgz",
  fileExtension: "tar.gz",
  prefix: "test",
};

const testCases: GetCachePathOptions[] = [jsonCase, yamlCase, tarballCase];

beforeAll(async () => {
  await clearCache(testCases);
});

describe("getResource function", () => {
  test("should fetch new JSON resource", async () => {
    const result = await getResource({
      ...jsonCase,
      responseType: "json",
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    const { data, cache } = result.value;

    expect(cache).toBe("miss");
    expect(data).toBeInstanceOf(Object);
    expect(data.name).toBe("ofetch");
    expect(data.version).toBe("1.5.1");
  });

  test("should get cached JSON resource", async () => {
    const result = await getResource({
      ...jsonCase,
      responseType: "json",
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    const { data, cache } = result.value;

    expect(cache).toBe("hit");
    expect(data).toBeInstanceOf(Object);
    expect(data.name).toBe("ofetch");
    expect(data.version).toBe("1.5.1");
  });

  test("should fetch new YAML resource", async () => {
    const result = await getResource({
      ...yamlCase,
      responseType: "text",
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    const { data, cache } = result.value;

    expect(cache).toBe("miss");
    expect(typeof data).toBe("string");

    const dataObject = Bun.YAML.parse(data);
    expect(dataObject).toBeInstanceOf(Object);
    // @ts-expect-error - for testing
    expect(dataObject.lockfileVersion).toBe("9.0");
  });

  test("should get cached YAML resource", async () => {
    const result = await getResource({
      ...yamlCase,
      responseType: "text",
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    const { data, cache } = result.value;

    expect(cache).toBe("hit");
    expect(typeof data).toBe("string");

    const dataObject = Bun.YAML.parse(data);
    expect(dataObject).toBeInstanceOf(Object);
    // @ts-expect-error - for testing
    expect(dataObject.lockfileVersion).toBe("9.0");
  });

  test("should fetch new tarball resource", async () => {
    const result = await getResource({
      ...tarballCase,
      responseType: "blob",
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    const { data, cache } = result.value;

    expect(cache).toBe("miss");
    expect(data).toBeInstanceOf(Blob);

    const archive = new Bun.Archive(data);
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
    expect(packageJSONContent.name).toBe("ofetch");
    expect(packageJSONContent.version).toBe("1.5.1");
  });

  test("should get cached tarball resource", async () => {
    const result = await getResource({
      ...tarballCase,
      responseType: "blob",
    });
    expect(result.isOk()).toBe(true);

    if (result.isErr()) {
      throw result.error;
    }

    const { data, cache } = result.value;

    expect(cache).toBe("hit");
    expect(data).toBeInstanceOf(Blob);

    const archive = new Bun.Archive(data);
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
    expect(packageJSONContent.name).toBe("ofetch");
    expect(packageJSONContent.version).toBe("1.5.1");
  });
});

afterAll(async () => {
  await clearCache(testCases);
});
