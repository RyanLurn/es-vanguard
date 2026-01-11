import { safeFetch } from "@/index";
import { parseJsonResponse } from "@/parse-json-response";
import {
  ClientError,
  FetchError,
  HttpError,
  InvalidJsonBodyError,
  ReadResponseError,
  ServerError,
  UnexpectedHttpError,
} from "@/utils/errors";
import type { UnexpectedError } from "@es-vanguard/telemetry/errors/fallback";
import { err, ok, Result } from "neverthrow";

export async function getJsonResponse(
  request: Request
): Promise<
  Result<
    any,
    | FetchError
    | ReadResponseError
    | InvalidJsonBodyError
    | HttpError
    | UnexpectedError
  >
> {
  const fetchResult = await safeFetch(request);
  if (fetchResult.isErr()) {
    return fetchResult;
  }
  const response = fetchResult.value;

  const parseJsonResult = await parseJsonResponse(response);
  if (parseJsonResult.isErr()) {
    return parseJsonResult;
  }
  const jsonBody = parseJsonResult.value;

  if (response.ok) {
    return ok(jsonBody);
  }

  const status = response.status;

  if (status >= 400 && status < 500) {
    const clientError = new ClientError({ request, response });
    return err(clientError);
  }

  if (status >= 500) {
    const serverError = new ServerError({ request, response });
    return err(serverError);
  }

  const unexpectedHttpError = new UnexpectedHttpError({ request, response });
  return err(unexpectedHttpError);
}
