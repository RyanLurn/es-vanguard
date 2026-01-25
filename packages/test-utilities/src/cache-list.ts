import { CACHE_LIST } from "#constants.ts";
import type { GetCachePathOptions } from "#get-cache-path.ts";

export type CacheReference = Record<string, GetCachePathOptions>;

export async function loadCacheList() {
  try {
    const cacheListFile = Bun.file(CACHE_LIST);
    if (!(await cacheListFile.exists())) {
      await Bun.write(CACHE_LIST, JSON.stringify({}));
      return {} as CacheReference;
    }

    return (await cacheListFile.json()) as CacheReference;
  } catch (error) {
    console.warn(`Failed to load cache list: ${error}`);
    return {} as CacheReference;
  }
}
