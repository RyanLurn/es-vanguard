import { getCachePath } from "#get-cache-path.ts";
import { getResource } from "#get-resource.ts";
import { beforeAll, describe, test, expect, afterAll } from "bun:test";

const jsonCase = {
  url: "https://registry.npmjs.org/ofetch/1.5.1",
  fileExtension: "json",
  prefix: "test",
};
const yamlCase = {
  url: "https://raw.githubusercontent.com/unjs/ofetch/main/pnpm-lock.yaml",
  fileExtension: "yaml",
  prefix: "test",
};
const tarballCase = {
  url: "https://registry.npmjs.org/ofetch/-/ofetch-1.5.1.tgz",
  fileExtension: "tar.gz",
  prefix: "test",
};

async function clearCache() {
  const jsonCachePath = getCachePath(jsonCase);
  const jsonCacheFile = Bun.file(jsonCachePath);
  if (await jsonCacheFile.exists()) {
    await jsonCacheFile.delete();
  }

  const yamlCachePath = getCachePath(yamlCase);
  const yamlCacheFile = Bun.file(yamlCachePath);
  if (await yamlCacheFile.exists()) {
    await yamlCacheFile.delete();
  }

  const tarballCachePath = getCachePath(tarballCase);
  const tarballCacheFile = Bun.file(tarballCachePath);
  if (await tarballCacheFile.exists()) {
    await tarballCacheFile.delete();
  }
}

beforeAll(async () => {
  await clearCache();
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
  await clearCache();
});
