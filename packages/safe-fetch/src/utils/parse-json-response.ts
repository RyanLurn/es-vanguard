import { InvalidJsonBodyError, ReadResponseError } from "@/utils/errors";
import { serializeResponse } from "@/utils/serialize/response";
import { createFallbackError } from "@es-vanguard/telemetry/errors/fallback";

export async function parseJsonResponse({ response }: { response: Response }) {
  const startTime = Bun.nanoseconds();

  try {
    return await response.json();
  } catch (error) {
    // End timing
    const endTime = Bun.nanoseconds();
    // Calculate timing
    const time = {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
    };

    // Serialize response
    const serializedResponse = serializeResponse({ response });

    // Expected error #1: The response's body is not valid JSON
    if (error instanceof SyntaxError) {
      const invalidJsonBodyError = new InvalidJsonBodyError({
        cause: error,
        response: serializedResponse,
      });
      throw invalidJsonBodyError;
    }

    // Expected error #2: The response's body could not be read
    if (error instanceof TypeError) {
      const readResponseError = new ReadResponseError({
        cause: error,
        response: serializedResponse,
      });
      throw readResponseError;
    }

    // Unexpected error fallback:
    const fallbackError = createFallbackError(error, serializedResponse);
    throw fallbackError;
  }
}
