import { ClientError, FetchError, ServerError } from "@/utils/errors";
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

type FetchStep = StepContext<"safe-fetch", SafeFetchOutputs>;

export interface SafeFetchContext extends Omit<StartContext<string>, "steps"> {
  steps: [...StartContext<string>["steps"], FetchStep];
}

export async function safeFetch<TPrevContext extends StartContext<string>>(
  { url, method = "GET", headers, body }: SafeFetchInputs,
  context: TPrevContext
) {
  const serializedRequestHeaders = headers
    ? serializeHeaders({ headers })
    : undefined;
  const serializedRequest = {
    url,
    method,
    headers: serializedRequestHeaders,
    body,
  };

  const startTime = Bun.nanoseconds();

  try {
    const response = await fetch(url, { method, headers, body });
    const endTime = Bun.nanoseconds();
    const time = {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
    };

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
        headers: serializedResponseHeaders,
      },
    };

    if (!response.ok) {
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
    }

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
    const endTime = Bun.nanoseconds();
    const time = {
      start: startTime,
      end: endTime,
      duration: endTime - startTime,
    };

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

    const fallbackError = createFallbackError(error);
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
