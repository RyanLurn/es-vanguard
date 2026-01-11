import { InvalidJsonBodyError, ReadResponseError } from "@/utils/errors";
import { serializeResponse } from "@/utils/serialize/response";
import type { SerializedResponse } from "@/utils/types";
import type { StartContext, StepContext } from "@es-vanguard/telemetry/context";
import {
  createFallbackError,
  UnexpectedError,
} from "@es-vanguard/telemetry/errors/fallback";
import { err, ok, Result } from "neverthrow";
import { serializeError } from "serialize-error";

interface TelemetryConfig<TPrevContext extends StartContext<string>> {
  context: TPrevContext;
  include?: {
    headers: boolean;
    body: boolean;
  };
}

type ParseJsonResponseStep = StepContext<
  "parse-json-response",
  SerializedResponse
>;

export interface ParseJsonResponseContext extends Omit<
  StartContext<string>,
  "steps"
> {
  steps: [...StartContext<string>["steps"], ParseJsonResponseStep];
}

export async function parseJsonResponse<
  TPrevContext extends StartContext<string>,
>(
  { response }: { response: Response },
  {
    context,
    include = {
      headers: false,
      body: false,
    },
  }: TelemetryConfig<TPrevContext>
): Promise<
  Result<
    { data: SerializedResponse; context: ParseJsonResponseContext },
    {
      error: InvalidJsonBodyError | ReadResponseError | UnexpectedError;
      context: ParseJsonResponseContext;
    }
  >
> {
  // Serialize response
  const serializedResponse = serializeResponse({
    response,
    includeHeaders: include.headers,
  });

  // Start timing
  const startTime = Bun.nanoseconds();

  try {
    // Parse the response body as JSON
    const parsedJson = await response.json();

    // End timing
    const endTime = Bun.nanoseconds();
    // Calculate timing
    const time = {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
    };

    // Create new context for telemetry
    const data = {
      ...serializedResponse,
      parsedBody: include.body ? parsedJson : undefined,
    };
    const newContext: ParseJsonResponseContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "parse-json-response",
          time,
          success: true,
          data,
        },
      ],
    };

    return ok({ data, context: newContext });
  } catch (error) {
    // End timing
    const endTime = Bun.nanoseconds();
    // Calculate timing
    const time = {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
    };

    // Expected error #1: The response's body is not valid JSON
    if (error instanceof SyntaxError) {
      // Construct the error object
      const invalidJsonBodyError = new InvalidJsonBodyError({
        cause: error,
        response: serializedResponse,
      });

      // Create new context for telemetry
      const newContext: ParseJsonResponseContext = {
        ...context,
        steps: [
          ...context.steps,
          {
            name: "parse-json-response",
            time,
            success: false,
            error: serializeError(invalidJsonBodyError),
          },
        ],
      };

      return err({ error: invalidJsonBodyError, context: newContext });
    }

    // Expected error #2: The response's body could not be read
    if (error instanceof TypeError) {
      // Construct the error object
      const readResponseError = new ReadResponseError({
        cause: error,
        response: serializedResponse,
      });

      // Create new context for telemetry
      const newContext: ParseJsonResponseContext = {
        ...context,
        steps: [
          ...context.steps,
          {
            name: "parse-json-response",
            time,
            success: false,
            error: serializeError(readResponseError),
          },
        ],
      };

      return err({ error: readResponseError, context: newContext });
    }

    // Unexpected error fallback:
    const fallbackError = createFallbackError(error, serializedResponse);

    // Create new context for telemetry
    const newContext: ParseJsonResponseContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "parse-json-response",
          time,
          success: false,
          error: serializeError(fallbackError),
        },
      ],
    };

    return err({ error: fallbackError, context: newContext });
  }
}
