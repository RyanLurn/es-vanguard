import { CACHE_DIR } from "#constants.ts";
import { join } from "node:path";

export function getCachePath({
  url,
  cacheDir = CACHE_DIR,
  fileExtension,
}: {
  url: string;
  cacheDir?: string;
  fileExtension?: string;
}) {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(url);
  const hash = hasher.digest("hex");

  const cacheFilePath = join(cacheDir, `${hash}.${fileExtension ?? "txt"}`);
  return cacheFilePath;
}
