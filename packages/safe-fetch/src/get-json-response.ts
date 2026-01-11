import { safeFetch, type SafeFetchContext } from "@/index";
import { parseJsonResponse } from "@/parse-json-response";
import { ClientError } from "@/utils/errors";
import { serializeHeaders } from "@/utils/serialize/headers";
import type { SerializedRequest } from "@/utils/types";
import type { StartContext } from "@es-vanguard/telemetry/context";

interface TelemetryConfig<TPrevContext extends StartContext<string>> {
  context: TPrevContext;
  include?: {
    requestHeaders?: boolean;
    requestBody?: boolean;
    responseHeaders?: boolean;
    responseBody?: boolean;
  };
}

export async function getJsonResponse<
  TPrevContext extends StartContext<string>,
>(
  { url, method = "GET", headers, body }: SerializedRequest,
  {
    context,
    include = {
      requestHeaders: true,
      requestBody: true,
      responseHeaders: true,
      responseBody: true,
    },
  }: TelemetryConfig<TPrevContext>
) {
  const fetchResult = await safeFetch<TPrevContext>(
    { url, method, headers, body },
    {
      context,
      include,
    }
  );

  if (fetchResult.isErr()) {
    return fetchResult;
  }

  const { data: response, context: fetchContext } = fetchResult.value;

  // Read response body as JSON
  const parseJsonResult = await parseJsonResponse<SafeFetchContext>(
    { response },
    {
      context: fetchContext,
      include,
    }
  );

  if (parseJsonResult.isErr()) {
    return parseJsonResult;
  }

  const { data: jsonResponse, context: parseJsonContext } =
    parseJsonResult.value;
}
