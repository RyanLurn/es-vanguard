import { serializeHeaders } from "@/utils/serialize/headers";
import { ExpectedError } from "@es-vanguard/telemetry/errors";

export class FetchTypeError extends ExpectedError {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;

  constructor(
    message: string,
    {
      url,
      method,
      headers,
      body,
      cause,
    }: {
      url: string;
      method: string;
      headers?: Headers | Record<string, string>;
      body?: any;
      cause: TypeError;
    }
  ) {
    super(message, { cause });
    this.name = "FetchTypeError";
    this.url = url;
    this.method = method;
    this.headers = headers ? serializeHeaders(headers) : undefined;
    this.body = body;
  }
}
