import { err, ok, type Result } from "neverthrow";

interface FetchOptions {
  githubBlobUrl: string;
  enableLogging?: boolean;
  maxRetries?: number;
  baseDelay?: number;
}

async function fetchGithubContent({
  githubBlobUrl,
  enableLogging = false,
  maxRetries = 3,
  baseDelay = 1000,
}: FetchOptions): Promise<Result<string, Error>> {
  // 1. Transform URL
  const rawUrl = githubBlobUrl
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");

  let lastError: Error | null = null;

  // 2. Retry Loop
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (enableLogging && attempt > 1) {
        console.log(`[Fetch] Attempt ${attempt}/${maxRetries} for ${rawUrl}`);
      }

      const response = await fetch(rawUrl);

      if (!response.ok) {
        // If it's a 404, retrying usually won't fix it, so we break early
        // to save time. 5xx errors are worth retrying.
        if (response.status === 404) {
          return err(new Error(`404 Not Found: ${rawUrl}`));
        }

        throw new Error(
          `HTTP Error ${response.status}: ${response.statusText}`
        );
      }

      const text = await response.text();
      return ok(text);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this was the last attempt, don't sleep, just exit loop to fail
      if (attempt === maxRetries) {
        break;
      }

      // Exponential Backoff: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await Bun.sleep(delay);
    }
  }

  // 3. Final Failure
  const errorMessage = `Failed to fetch ${rawUrl} after ${maxRetries} attempts. Last error: ${lastError?.message}`;
  if (enableLogging) {
    console.error(errorMessage);
  }

  return err(new Error(errorMessage));
}

export { fetchGithubContent };
