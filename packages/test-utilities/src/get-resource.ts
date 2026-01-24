import { CACHE_DIR } from "#constants.ts";
import { err, ok, type Result } from "neverthrow";
import { join } from "node:path";
import { ofetch } from "ofetch";

export async function getResource({
  url,
  responseType = "json",
  fileExtension,
  forceRefresh = false,
}: {
  url: string;
  responseType?: "text" | "json" | "arrayBuffer" | "blob" | "stream";
  fileExtension?: string;
  forceRefresh?: boolean;
}) {
  try {
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(url);
    const hash = hasher.digest("hex");
    const cacheFilePath = join(CACHE_DIR, `${hash}.${fileExtension ?? "txt"}`);

    const cachedFile = Bun.file(cacheFilePath);
    if (!forceRefresh && (await cachedFile.exists())) {
      if (responseType === "blob") {
        return ok(cachedFile);
      }

      const content = await cachedFile[responseType]();
      return ok(content);
    }

    const response = await ofetch.raw(url, {
      responseType,
      retry: 3,
      retryDelay: 500,
    });

    try {
      await Bun.write(cacheFilePath, response);
    } catch (error) {
      console.warn(
        `Failed to cache resource at "${url}" to "${cacheFilePath}":\n`,
        error
      );
    }

    return ok(response._data);
  } catch (error) {
    return err(error);
  }
}
