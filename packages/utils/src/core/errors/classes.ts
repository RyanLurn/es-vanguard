import type { ZodError } from "zod";

export interface CustomErrorType {
  code: string;
  message: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class CustomError extends Error implements CustomErrorType {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(options: CustomErrorType) {
    super(options.message, { cause: options.cause });
    this.name = this.constructor.name;
    this.code = options.code;
    this.context = options.context;
  }
}

export class UnexpectedError extends CustomError {
  constructor(
    message: string,
    options?: { cause?: unknown; context?: Record<string, unknown> }
  ) {
    super({
      code: "UNEXPECTED_ERROR",
      message: message,
      cause: options?.cause,
      context: options?.context,
    });
  }
}

export class ValidationError extends CustomError {
  constructor(
    message: string,
    options: {
      cause: ZodError;
      context: {
        inputs: unknown;
      };
    }
  ) {
    super({
      code: "VALIDATION_ERROR",
      message: message,
      cause: options.cause,
      context: options.context,
    });
  }
}
