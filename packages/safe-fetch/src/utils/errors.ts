import type { SerializedRequest, SerializedResponse } from "@/utils/types";
import { ExpectedError } from "@es-vanguard/telemetry/errors";

export class FetchTypeError extends ExpectedError {
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
    this.name = "FetchTypeError";
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
