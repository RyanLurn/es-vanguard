import type {
  ReadResponse,
  SerializedRequest,
  SerializedResponse,
} from "@/utils/types";
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
  request: SerializedRequest;

  constructor(
    message: string,
    {
      request,
      cause,
    }: {
      request: SerializedRequest;
      cause: TypeError;
    }
  ) {
    super(message, { cause });
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
  response: ReadResponse;

  constructor({
    cause,
    response,
  }: {
    cause: TypeError;
    response: ReadResponse;
  }) {
    super("This response body has been disturbed or locked.", { cause });
    this.name = "ReadResponseError";
    this.response = response;
  }
}

export class ParseJsonBodyError extends ExpectedError {
  rawText?: string;
  response: ReadResponse;

  constructor({
    cause,
    rawText,
    response,
  }: {
    cause: SyntaxError;
    rawText?: string;
    response: ReadResponse;
  }) {
    super("This response body cannot be parsed as JSON.", { cause });
    this.name = "ParseJsonBodyError";
    this.rawText = rawText;
    this.response = response;
  }
}
