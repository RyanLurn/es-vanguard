import { CustomError } from "@es-vanguard/telemetry/errors/classes";
import { createFallbackError } from "@es-vanguard/telemetry/errors/fallback";
import { err, ok, Result } from "neverthrow";

export async function parseJsonResponse(
  response: Response
): Promise<Result<any, CustomError>> {
  const context = {
    format: "json",
    response: {
      bodyUsed: response.bodyUsed,
      status: response.status,
      statusText: response.statusText,
    },
  };

  try {
    const json = await response.json();
    return ok(json);
  } catch (error) {
    if (error instanceof SyntaxError) {
      const parseResponseError = new CustomError(
        "This response body is invalid JSON",
        {
          cause: error,
          code: "PARSE_RESPONSE_ERROR",
          expected: true,
          context,
        }
      );
      return err(parseResponseError);
    }

    if (error instanceof TypeError) {
      const readResponseError = new CustomError(
        "This response body's stream has been locked or disturbed",
        {
          cause: error,
          code: "READ_RESPONSE_ERROR",
          expected: true,
          context,
        }
      );
      return err(readResponseError);
    }

    const fallbackError = createFallbackError({ error, context });
    return err(fallbackError);
  }
}
