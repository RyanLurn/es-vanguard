import { betterFetch } from "@better-fetch/fetch";
import { serializeUnknown } from "@es-vanguard/telemetry/errors/serialize-unknown";
import { err, ok } from "neverthrow";

export async function getTarball({ tarballURL }: { tarballURL: string }) {
  try {
    const data = await betterFetch<Blob>(tarballURL, {
      throw: true,
      timeout: 5000, // 5 seconds
      retry: {
        type: "exponential",
        attempts: 3,
        baseDelay: 500, // 0.5 seconds
        maxDelay: 2000, // 2 seconds
        shouldRetry: (response) => {
          if (response === null) {
            return true;
          }
          if (response.status === 429 || response.status === 503) {
            return true;
          }
          return false;
        },
      },
    });

    return ok(data);
  } catch (error) {
    if (error instanceof Error) {
      return err(error);
    }

    const fallbackError = serializeUnknown(error);
    return err(fallbackError);
  }
}
