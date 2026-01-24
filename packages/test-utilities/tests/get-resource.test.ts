import { getCachePath } from "#get-cache-path.ts";
import { getResource } from "#get-resource.ts";
import { beforeAll, describe, test, expect, afterAll } from "bun:test";

const jsonURL = "https://registry.npmjs.org/ofetch/1.5.1";
const tarURL = "https://registry.npmjs.org/ofetch/-/ofetch-1.5.1.tgz";

async function clearCache() {
  const jsonCachePath = getCachePath({ url: jsonURL, fileExtension: "json" });
  const jsonCacheFile = Bun.file(jsonCachePath);
  if (await jsonCacheFile.exists()) {
    await jsonCacheFile.delete();
  }

  const tarCachePath = getCachePath({ url: tarURL, fileExtension: "tar.gz" });
  const tarCacheFile = Bun.file(tarCachePath);
  if (await tarCacheFile.exists()) {
    await tarCacheFile.delete();
  }
}

beforeAll(async () => {
  await clearCache();
});

describe("getResource function", () => {
  test("should fetch new JSON resource", async () => {
    const result = await getResource({
      url: jsonURL,
      responseType: "json",
      fileExtension: "json",
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
      url: jsonURL,
      responseType: "json",
      fileExtension: "json",
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

  test("should fetch new tarball", async () => {
    const result = await getResource({
      url: tarURL,
      responseType: "blob",
      fileExtension: "tar.gz",
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

  test("should get cached tarball", async () => {
    const result = await getResource({
      url: tarURL,
      responseType: "blob",
      fileExtension: "tar.gz",
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
