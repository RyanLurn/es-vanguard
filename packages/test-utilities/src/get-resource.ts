import { getCachePath } from "#get-cache-path.ts";
import type { HeadersInit } from "bun";
import { err, ok, type Result } from "neverthrow";
import { ofetch } from "ofetch";

export async function getResource({
  url,
  responseType = "json",
  fileExtension,
  cacheDir,
  forceRefresh = false,
  headers,
  enableLogging = false,
  prefix,
}: {
  url: string;
  responseType?: "text" | "json" | "arrayBuffer" | "blob" | "stream";
  fileExtension?: string;
  cacheDir?: string;
  forceRefresh?: boolean;
  headers?: HeadersInit;
  enableLogging?: boolean;
  prefix?: string;
}): Promise<Result<{ data: any; cache: "hit" | "miss" }, unknown>> {
  try {
    const cacheFilePath = getCachePath({
      url,
      fileExtension,
      cacheDir,
      prefix,
    });

    const cachedFile = Bun.file(cacheFilePath);
    if (!forceRefresh && (await cachedFile.exists())) {
      if (enableLogging) {
        console.log(`[Get resource] Cache hit for "${url}"`);
      }

      if (responseType === "blob") {
        const blob = new Blob([await cachedFile.arrayBuffer()], {
          type: cachedFile.type,
        });
        return ok({ data: blob, cache: "hit" });
      }

      const content = await cachedFile[responseType]();
      return ok({ data: content, cache: "hit" });
    }

    if (enableLogging) {
      console.log(`[Get resource] Cache miss for "${url}"`);
    }
    const data = await ofetch(url, {
      responseType,
      retry: 3,
      retryDelay: 500,
      headers,
      onRequest: () => {
        if (enableLogging) {
          console.log(`[Get resource] Fetching resource from "${url}"`);
        }
      },
    });

    if (enableLogging) {
      console.log(`[Get resource] Caching resource from "${url}"`);
    }
    try {
      if (responseType === "json") {
        await Bun.write(cacheFilePath, JSON.stringify(data));
      } else if (responseType === "stream") {
        await Bun.write(
          cacheFilePath,
          await Bun.readableStreamToArrayBuffer(data)
        );
      } else {
        await Bun.write(cacheFilePath, data);
      }

      if (enableLogging) {
        console.log(
          `[Get resource] Cached resource from "${url}" to "${cacheFilePath}"`
        );
      }
    } catch (error) {
      if (enableLogging) {
        console.warn(
          `[Get resource] Failed to cache resource from "${url}" to "${cacheFilePath}":\n`,
          error
        );
      }
    }

    return ok({ data, cache: "miss" });
  } catch (error) {
    if (enableLogging) {
      console.error(
        `[Get resource] Failed to fetch resource from "${url}":\n`,
        error
      );
    }
    return err(error);
  }
}
