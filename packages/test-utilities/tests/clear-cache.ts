import type { GetCachePathOptions } from "#get-cache-path.ts";
import { getCachePath } from "#get-cache-path.ts";

export async function clearCache(getCachePathOptions: GetCachePathOptions) {
  const cachePath = getCachePath(getCachePathOptions);
  const cacheFile = Bun.file(cachePath);
  if (await cacheFile.exists()) {
    await cacheFile.delete();
  }
}
