import { FetchError } from "@/utils/errors";
import type { SerializedRequest } from "@/utils/types";
import type { StartContext, StepContext } from "@es-vanguard/telemetry/context";
import {
  createFallbackError,
  UnexpectedError,
} from "@es-vanguard/telemetry/errors/fallback";
import { err, ok, Result } from "neverthrow";
import { serializeError } from "serialize-error";

type FetchStep = StepContext<"safe-fetch", SerializedRequest>;

export interface SafeFetchContext extends Omit<StartContext<string>, "steps"> {
  steps: [...StartContext<string>["steps"], FetchStep];
}

interface TelemetryConfig<TPrevContext extends StartContext<string>> {
  context: TPrevContext;
  include?: {
    requestHeaders?: boolean;
    requestBody?: boolean;
  };
}

export async function safeFetch<TPrevContext extends StartContext<string>>(
  { url, method = "GET", headers, body }: SerializedRequest,
  {
    context,
    include = { requestHeaders: true, requestBody: true },
  }: TelemetryConfig<TPrevContext>
): Promise<
  Result<
    { data: Response; context: SafeFetchContext },
    { error: FetchError | UnexpectedError; context: SafeFetchContext }
  >
> {
  // Prepare telemetry data
  const telemetryData: SerializedRequest = {
    url,
    method,
    headers: include.requestHeaders ? headers : undefined,
    body: include.requestBody ? body : undefined,
  };

  // Start timing
  const startTime = Bun.nanoseconds();

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // End timing
    const endTime = Bun.nanoseconds();
    // Calculate timing
    const time = {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
    };

    const newContext: SafeFetchContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "safe-fetch",
          time,
          success: true,
          data: telemetryData,
        },
      ],
    };

    return ok({ data: response, context: newContext });
  } catch (error) {
    // End timing
    const endTime = Bun.nanoseconds();
    // Calculate timing
    const time = {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
    };

    // Handle invalid url, network errors, etc.
    if (error instanceof TypeError) {
      const fetchError = new FetchError(`Failed to fetch: ${url}`, {
        request: telemetryData,
        cause: error,
      });

      const newContext: SafeFetchContext = {
        ...context,
        steps: [
          ...context.steps,
          {
            name: "safe-fetch",
            time,
            success: false,
            error: serializeError(fetchError),
          },
        ],
      };

      return err({ error: fetchError, context: newContext });
    }

    // Handle other unexpected errors
    const fallbackError = createFallbackError(error, telemetryData);
    const newContext: SafeFetchContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "safe-fetch",
          time,
          success: false,
          error: serializeError(fallbackError),
        },
      ],
    };

    return err({ error: fallbackError, context: newContext });
  }
}
