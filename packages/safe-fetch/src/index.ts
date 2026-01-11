import { FetchError } from "@/utils/errors";
import {
  createFallbackError,
  UnexpectedError,
} from "@es-vanguard/telemetry/errors/fallback";
import { err, ok, Result } from "neverthrow";

export async function safeFetch(
  request: Request
): Promise<Result<Response, FetchError | UnexpectedError>> {
  try {
    const response = await fetch(request);
    return ok(response);
  } catch (error) {
    if (error instanceof TypeError) {
      const fetchError = new FetchError({
        request,
        cause: error,
      });

      return err(fetchError);
    }

    const fallbackError = createFallbackError(error, request);
    return err(fallbackError);
  }
}
