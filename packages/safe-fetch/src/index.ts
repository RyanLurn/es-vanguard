import { FetchError } from "@/utils/errors";
import { serializeHeaders } from "@/utils/serialize/headers";
import type { StartContext, StepContext } from "@es-vanguard/telemetry/context";
import type { SerializedRequest, SerializedResponse } from "@/utils/types";
import { ok } from "neverthrow";

type FetchStep = StepContext<
  "safe-fetch",
  { request: SerializedRequest; response?: SerializedResponse }
>;

export interface SafeFetchContext<TPrevStepName extends string> extends Omit<
  StartContext<TPrevStepName>,
  "steps"
> {
  steps: [...StartContext<TPrevStepName>["steps"], FetchStep];
}

export async function safeFetch<
  TPrevStepName extends string,
  TPrevContext extends StartContext<TPrevStepName>,
>(
  {
    url,
    method = "GET",
    headers,
    body,
  }: {
    url: string;
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit;
  },
  context: TPrevContext
) {
  const startTime = Bun.nanoseconds();
  const serializedRequestHeaders = headers
    ? serializeHeaders({ headers })
    : undefined;

  try {
    const response = await fetch(url, { method, headers, body });
    const endTime = Bun.nanoseconds();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newContext: SafeFetchContext<TPrevStepName> = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "safe-fetch",
          time: {
            start: startTime,
            end: endTime,
            duration: endTime - startTime,
          },
          success: true,
          data: {
            request: {
              url,
              method,
              headers: serializedRequestHeaders,
              body,
            },
            response: {
              status: response.status,
              statusText: response.statusText,
              headers: serializeHeaders({ headers: response.headers }),
            },
          },
        },
      ],
    };

    return ok({ data: response, context: newContext });
  } catch (error) {
    const endTime = Bun.nanoseconds();

    if (error instanceof TypeError) {
      const fetchError = new FetchError(`Failed to fetch: ${url}`, {
        request: {
          url,
          method,
          headers: headers ? serializeHeaders({ headers }) : undefined,
          body,
        },
        cause: error,
      });
    }
  }
}
