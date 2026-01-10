import {
  ClientError,
  FetchError,
  ServerError,
  UnexpectedHttpError,
} from "@/utils/errors";
import { serializeHeaders } from "@/utils/serialize/headers";
import type { StartContext, StepContext } from "@es-vanguard/telemetry/context";
import type { SerializedRequest, SerializedResponse } from "@/utils/types";
import { err, ok } from "neverthrow";
import { serializeError } from "serialize-error";
import { createFallbackError } from "@es-vanguard/telemetry/errors/fallback";

interface SafeFetchInputs {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
}

interface SafeFetchOutputs {
  request: SerializedRequest;
  response: SerializedResponse;
}

interface TelemetryConfig<TPrevContext extends StartContext<string>> {
  context: TPrevContext;
  include?: {
    requestHeaders: boolean;
    requestBody: boolean;
    responseHeaders: boolean;
    responseBody: boolean;
  };
}

type FetchStep = StepContext<"safe-fetch", SafeFetchOutputs>;

export interface SafeFetchContext extends Omit<StartContext<string>, "steps"> {
  steps: [...StartContext<string>["steps"], FetchStep];
}

export async function safeFetch<TPrevContext extends StartContext<string>>(
  { url, method = "GET", headers, body }: SafeFetchInputs,
  {
    context,
    include = {
      requestHeaders: false,
      requestBody: false,
      responseHeaders: false,
      responseBody: false,
    },
  }: TelemetryConfig<TPrevContext>
) {
  // Serialize request data
  const serializedRequestHeaders = headers
    ? serializeHeaders({ headers })
    : undefined;
  const serializedRequest = {
    url,
    method,
    headers: include.requestHeaders ? serializedRequestHeaders : undefined,
    body: include.requestBody ? body : undefined,
  };

  // Start timing
  const startTime = Bun.nanoseconds();

  try {
    // Make the fetch request
    const response = await fetch(url, { method, headers, body });

    // End timing
    const endTime = Bun.nanoseconds();
    // Calculate timing
    const time = {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
    };

    // Extract response data
    const status = response.status;
    const statusText = response.statusText;
    const serializedResponseHeaders = serializeHeaders({
      headers: response.headers,
    });
    const outputs: SafeFetchOutputs = {
      request: serializedRequest,
      response: {
        status,
        statusText,
        headers: include.responseHeaders
          ? serializedResponseHeaders
          : undefined,
      },
    };

    // Check if response is not ok
    // Expected failure case: the request was made but the server returned an error
    if (!response.ok) {
      // Handle client errors (4xx)
      if (status >= 400 && status < 500) {
        const clientError = new ClientError(
          `Bad fetch request. [${status}]: ${statusText}`,
          outputs
        );

        const newContext: SafeFetchContext = {
          ...context,
          steps: [
            ...context.steps,
            {
              name: "safe-fetch",
              time,
              success: false,
              error: serializeError(clientError),
            },
          ],
        };

        return err({ error: clientError, context: newContext });
      }

      // Handle server errors (5xx)
      if (status >= 500) {
        const serverError = new ServerError(
          `Server error. [${status}]: ${statusText}`,
          outputs
        );

        const newContext: SafeFetchContext = {
          ...context,
          steps: [
            ...context.steps,
            {
              name: "safe-fetch",
              time,
              success: false,
              error: serializeError(serverError),
            },
          ],
        };

        return err({ error: serverError, context: newContext });
      }

      // Fallback: handle unexpected HTTP status codes
      const unexpectedHttpError = new UnexpectedHttpError(
        `Unexpected HTTP status code encountered. [${status}]: ${statusText}`,
        outputs
      );

      const newContext: SafeFetchContext = {
        ...context,
        steps: [
          ...context.steps,
          {
            name: "safe-fetch",
            time,
            success: false,
            error: serializeError(unexpectedHttpError),
          },
        ],
      };

      return err({ error: unexpectedHttpError, context: newContext });
    }

    // Success case: the request was made and status is 2xx
    const newContext: SafeFetchContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "safe-fetch",
          time,
          success: true,
          data: outputs,
        },
      ],
    };

    return ok({ data: response, context: newContext });
  } catch (error) {
    // Unexpected failure case: the request failed before we could even get a response

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
        request: serializedRequest,
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
    const fallbackError = createFallbackError(error, serializedRequest);
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
