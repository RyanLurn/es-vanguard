import { prettifyError, type ZodError } from "zod";

export class ExpectedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ExpectedError";
  }
}

export class ValidationError extends ExpectedError {
  issues: ZodError["issues"];

  constructor(zodError: ZodError) {
    super(prettifyError(zodError), { cause: zodError });
    this.name = "ValidationError";
    this.issues = zodError.issues;
  }
}

interface HttpErrorRequest {
  original: Request;
  sentBody?: any;
}

interface HttpErrorResponse {
  original: Response;
  parsedBody?: any;
}

interface HttpErrorOptions {
  request: HttpErrorRequest;
  response: HttpErrorResponse;
}

export class HttpError extends ExpectedError {
  request: HttpErrorRequest;
  response: HttpErrorResponse;

  constructor(message: string, options: HttpErrorOptions) {
    super(message);
    this.name = "HttpError";
    this.request = options.request;
    this.response = options.response;
  }
}
