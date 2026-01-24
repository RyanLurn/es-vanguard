import { CACHE_DIR } from "#constants.ts";
import { $fetch } from "#lib/fetch.ts";
import { err, ok, type Result } from "neverthrow";
import { join } from "node:path";

export async function getResource<TData = unknown>({
  url,
}: {
  url: string;
}): Promise<Result<TData, unknown>> {
  try {
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(url);
    const hash = hasher.digest("hex");
    const cacheFilePath = join(CACHE_DIR, `${hash}.txt`);

    const cachedFile = Bun.file(cacheFilePath);
    if (await cachedFile.exists()) {
      const content = await cachedFile.text();
      // return ok(content);
    }

    const { data, error } = await $fetch<TData>(url);
    if (error) {
      return err(error);
    }
    return ok(data);
  } catch (error) {
    return err(error);
  }
}
