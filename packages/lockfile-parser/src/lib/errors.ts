export interface AppErrorType {
  code: string;
  message: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class AppError extends Error implements AppErrorType {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(options: AppErrorType) {
    super(options.message, { cause: options.cause });
    this.name = this.constructor.name;
    this.code = options.code;
    this.context = options.context;
  }
}

export class ExpectedError extends AppError {
  constructor(
    message: string,
    options?: { cause?: unknown; context?: Record<string, unknown> }
  ) {
    super({
      code: "EXPECTED_ERROR",
      message: message,
      cause: options?.cause,
      context: options?.context,
    });
  }
}

export class UnexpectedError extends AppError {
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
