import { ExpectedError } from "@es-vanguard/telemetry/errors";
import { UnexpectedError } from "@es-vanguard/telemetry/errors/fallback";

export class UnexpectedHttpError extends UnexpectedError {
  request: Request;
  response: Response;

  constructor({ request, response }: { request: Request; response: Response }) {
    super("Unexpected HTTP error");
    this.name = "UnexpectedHttpError";
    this.request = request;
    this.response = response;
  }
}

export class FetchError extends ExpectedError {
  request: Request;

  constructor({ request, cause }: { request: Request; cause: TypeError }) {
    super(`Failed to fetch: ${request.url}`, { cause });
    this.name = "FetchError";
    this.request = request;
  }
}

export class HttpError extends ExpectedError {
  request: Request;
  response: Response;

  constructor({ request, response }: { request: Request; response: Response }) {
    super(`[${response.status}]: ${response.statusText}`);
    this.name = "HttpError";
    this.request = request;
    this.response = response;
  }
}

export class ClientError extends HttpError {
  constructor({ request, response }: { request: Request; response: Response }) {
    super({
      request,
      response,
    });
    this.name = "ClientError";
  }
}

export class ServerError extends HttpError {
  constructor({ request, response }: { request: Request; response: Response }) {
    super({
      request,
      response,
    });
    this.name = "ServerError";
  }
}

export class ReadResponseError extends ExpectedError {
  response: Response;

  constructor({ cause, response }: { cause: TypeError; response: Response }) {
    super("This response body has been disturbed or locked.", { cause });
    this.name = "ReadResponseError";
    this.response = response;
  }
}

export class InvalidJsonBodyError extends ExpectedError {
  response: Response;

  constructor({ cause, response }: { cause: SyntaxError; response: Response }) {
    super("This response body cannot be parsed as JSON.", { cause });
    this.name = "InvalidJsonBodyError";
    this.response = response;
  }
}
