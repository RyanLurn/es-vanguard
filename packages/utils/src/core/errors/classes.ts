import { prettifyError, type ZodError } from "zod";

export class UnexpectedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "UnexpectedError";
  }
}

export class ExoticError extends UnexpectedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ExoticError";
  }
}

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
