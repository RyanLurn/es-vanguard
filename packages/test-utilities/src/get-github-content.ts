import { join } from "node:path";
import { mkdir } from "node:fs/promises";
import { err, ok, type Result } from "neverthrow";
import { fetchGithubContent } from "#fetch-github-content.ts";

// Store cache in the package root: packages/test-utilities/.cache
const CACHE_DIR = join(import.meta.dir, "../.cache");

interface GetOptions {
  githubBlobUrl: string;
  enableLogging?: boolean;
  forceRefresh?: boolean; // Useful if you suspect the remote file changed
}

async function getGithubContent({
  githubBlobUrl,
  enableLogging = false,
  forceRefresh = false,
}: GetOptions): Promise<Result<string, Error>> {
  try {
    // 1. Generate Cache Key (MD5)
    // We use MD5 because it's fast and filename-safe.
    // We aren't using it for security, just uniqueness.
    const hasher = new Bun.CryptoHasher("md5");
    hasher.update(githubBlobUrl);
    const hash = hasher.digest("hex");
    const cacheFilePath = join(CACHE_DIR, `${hash}.txt`);

    // 2. Check Cache (skip if forceRefresh is true)
    if (!forceRefresh) {
      const cachedFile = Bun.file(cacheFilePath);
      if (await cachedFile.exists()) {
        if (enableLogging) {
          console.log(`[Cache Hit] ${githubBlobUrl}`);
        }
        const content = await cachedFile.text();
        return ok(content);
      }
    }

    if (enableLogging) {
      console.log(`[Cache Miss] Fetching ${githubBlobUrl}...`);
    }

    // 3. Network Request (Delegate to our robust fetcher)
    const fetchResult = await fetchGithubContent({
      githubBlobUrl,
      enableLogging,
    });

    if (fetchResult.isErr()) {
      return err(fetchResult.error);
    }

    const content = fetchResult.value;

    // 4. Save to Cache
    // We deliberately swallow write errors here because caching failure
    // shouldn't crash the program, but we log them.
    try {
      await mkdir(CACHE_DIR, { recursive: true });
      await Bun.write(cacheFilePath, content);
      if (enableLogging) {
        console.log(`[Cache Write] Saved to ${cacheFilePath}`);
      }
    } catch (writeError) {
      console.warn(
        `[Cache Warning] Failed to write cache for ${githubBlobUrl}`,
        writeError
      );
    }

    return ok(content);
  } catch (error) {
    // Catch-all for unexpected filesystem/hashing errors
    const e = error instanceof Error ? error : new Error(String(error));
    if (enableLogging) {
      console.error("[Get Content Error]", e);
    }
    return err(e);
  }
}

export { getGithubContent };
