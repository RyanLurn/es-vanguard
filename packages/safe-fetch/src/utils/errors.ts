import { ExpectedError } from "@es-vanguard/telemetry/errors";

export class RequestConstructionError extends ExpectedError {
  input: RequestInfo;
  init?: RequestInit;

  constructor(
    message: string,
    {
      input,
      init,
      cause,
    }: { input: RequestInfo; init?: RequestInit; cause: TypeError }
  ) {
    super(message, { cause });
    this.name = "RequestConstructionError";
    this.input = input;
    this.init = init;
  }
}

export class FetchTypeError extends ExpectedError {
  request: Request;

  constructor(
    message: string,
    { request, cause }: { request: Request; cause: TypeError }
  ) {
    super(message, { cause });
    this.name = "FetchTypeError";
    this.request = request;
  }
}
