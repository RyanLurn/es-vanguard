import { serializeHeaders } from "@/utils/serialize/headers";
import type { SerializedResponse } from "@/utils/types";

export function serializeResponse({
  response,
  includeHeaders = true,
  parsedBody,
}: {
  response: Response;
  includeHeaders?: boolean;
  parsedBody?: any;
}) {
  const serializedResponse: SerializedResponse = {
    status: response.status,
    statusText: response.statusText,
    headers: includeHeaders
      ? serializeHeaders({ headers: response.headers })
      : undefined,
    parsedBody,
  };

  return serializedResponse;
}
