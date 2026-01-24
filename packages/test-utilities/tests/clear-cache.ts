import type { GetCachePathOptions } from "#get-cache-path.ts";
import { getCachePath } from "#get-cache-path.ts";

export async function clearCache(cases: GetCachePathOptions[]) {
  for (const testCase of cases) {
    const cachePath = getCachePath(testCase);
    const cacheFile = Bun.file(cachePath);
    if (await cacheFile.exists()) {
      await cacheFile.delete();
    }
  }
}
