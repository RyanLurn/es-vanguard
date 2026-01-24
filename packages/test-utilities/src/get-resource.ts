import { getCachePath } from "#get-cache-path.ts";
import { err, ok, type Result } from "neverthrow";
import { ofetch } from "ofetch";

export async function getResource({
  url,
  responseType = "json",
  fileExtension,
  cacheDir,
  forceRefresh = false,
}: {
  url: string;
  responseType?: "text" | "json" | "arrayBuffer" | "blob" | "stream";
  fileExtension?: string;
  cacheDir?: string;
  forceRefresh?: boolean;
}): Promise<Result<any, unknown>> {
  try {
    const cacheFilePath = getCachePath({ url, fileExtension, cacheDir });

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
