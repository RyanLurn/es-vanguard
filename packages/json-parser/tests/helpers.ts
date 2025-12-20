import { join } from "node:path";
import { mkdir } from "node:fs/promises";

// Create a .cache folder relative to this file (in packages/json-parser/tests/.cache)
const CACHE_DIR = join(import.meta.dir, ".cache");

/**
 * Transforms a GitHub Blob URL to a Raw URL and fetches the content.
 * Uses a local file cache to prevent network spam.
 */
async function fetchRemoteLockfile(
  githubBlobUrl: string,
  enableLogging = false
): Promise<string> {
  // 1. Create Cache Key (MD5 hash of the URL is short and filesystem-safe)
  const hasher = new Bun.CryptoHasher("md5");
  hasher.update(githubBlobUrl);
  const hash = hasher.digest("hex");
  const cachePath = join(CACHE_DIR, `${hash}.txt`); // Save as .txt

  // 2. Check Cache
  const cachedFile = Bun.file(cachePath);
  if (await cachedFile.exists()) {
    if (enableLogging) {
      console.log(`[Cache Hit] ${githubBlobUrl}`);
    }
    return cachedFile.text();
  }

  if (enableLogging) {
    console.log(`[Cache Miss] Downloading ${githubBlobUrl}...`);
  }

  // 3. Convert URL & Fetch
  const rawUrl = githubBlobUrl
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");

  const response = await fetch(rawUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch remote lockfile: ${response.status} ${response.statusText}`
    );
  }

  const content = await response.text();

  // 4. Save to Cache
  // Ensure directory exists first
  await mkdir(CACHE_DIR, { recursive: true });
  await Bun.write(cachePath, content);

  return content;
}

export { fetchRemoteLockfile };
