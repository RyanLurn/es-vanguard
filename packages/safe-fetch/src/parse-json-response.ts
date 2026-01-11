import { InvalidJsonBodyError, ReadResponseError } from "#errors.js";
import {
  createFallbackError,
  UnexpectedError,
} from "@es-vanguard/telemetry/errors/fallback";
import { err, ok, Result } from "neverthrow";

export async function parseJsonResponse(
  response: Response
): Promise<
  Result<any, InvalidJsonBodyError | ReadResponseError | UnexpectedError>
> {
  try {
    const parsedJson = await response.json();
    return ok(parsedJson);
  } catch (error) {
    if (error instanceof SyntaxError) {
      const invalidJsonBodyError = new InvalidJsonBodyError({
        cause: error,
        response,
      });

      return err(invalidJsonBodyError);
    }

    if (error instanceof TypeError) {
      const readResponseError = new ReadResponseError({
        cause: error,
        response,
      });

      return err(readResponseError);
    }

    const fallbackError = createFallbackError(error, response);
    return err(fallbackError);
  }
}
