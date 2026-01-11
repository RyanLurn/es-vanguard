import { serializeHeaders } from "@/utils/serialize/headers";
import type { SerializedRequest } from "@/utils/types";

export function serializeRequestBody({
  body,
}: {
  body: string | Record<string, any>;
}) {
  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
}

export function serializeRequest({
  url,
  method = "GET",
  headers,
  body,
}: {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: string | Record<string, any>;
}): SerializedRequest {
  return {
    url,
    method,
    headers: headers ? serializeHeaders({ headers }) : undefined,
    body: body ? serializeRequestBody({ body }) : undefined,
  };
}
