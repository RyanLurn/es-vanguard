import { CACHE_DIR } from "#constants.ts";
import { join } from "node:path";

export function getCachePath({
  url,
  cacheDir = CACHE_DIR,
  fileExtension,
  prefix,
}: {
  url: string;
  cacheDir?: string;
  fileExtension?: string;
  prefix?: string;
}) {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(url);
  const hash = hasher.digest("hex");

  const cacheFilePath = join(
    cacheDir,
    `${prefix ? `${prefix}-` : ""}${hash}.${fileExtension ?? "txt"}`
  );
  return cacheFilePath;
}
