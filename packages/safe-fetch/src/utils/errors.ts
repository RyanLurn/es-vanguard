import type { SerializedRequest, SerializedResponse } from "@/utils/types";
import { ExpectedError } from "@es-vanguard/telemetry/errors";
import { UnexpectedError } from "@es-vanguard/telemetry/errors/fallback";

export class UnexpectedHttpError extends UnexpectedError {
  request: SerializedRequest;
  response: SerializedResponse;

  constructor(
    message: string,
    {
      request,
      response,
    }: { request: SerializedRequest; response: SerializedResponse }
  ) {
    super(message);
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
  request: SerializedRequest;
  response: SerializedResponse;

  constructor(
    message: string,
    {
      request,
      response,
    }: { request: SerializedRequest; response: SerializedResponse }
  ) {
    super(message);
    this.name = "HttpError";
    this.request = request;
    this.response = response;
  }
}

export class ClientError extends HttpError {
  constructor(
    message: string,
    {
      request,
      response,
    }: { request: SerializedRequest; response: SerializedResponse }
  ) {
    super(message, { request, response });
    this.name = "ClientError";
  }
}

export class ServerError extends HttpError {
  constructor(
    message: string,
    {
      request,
      response,
    }: { request: SerializedRequest; response: SerializedResponse }
  ) {
    super(message, { request, response });
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
