export class UnexpectedError extends Error {
  inputs: unknown;

  constructor(message: string, options?: ErrorOptions, inputs?: unknown) {
    super(message, options);
    this.name = "UnexpectedError";
    this.inputs = inputs;
  }
}

export class ExoticError extends UnexpectedError {
  constructor(message: string, options?: ErrorOptions, inputs?: unknown) {
    super(message, options, inputs);
    this.name = "ExoticError";
  }
}

export function createFallbackError(error: unknown, inputs?: unknown) {
  if (error instanceof Error) {
    return new UnexpectedError(error.message, { cause: error }, inputs);
  }

  try {
    return new ExoticError(JSON.stringify(error), { cause: error }, inputs);
  } catch {
    try {
      return new ExoticError(String(error), { cause: error }, inputs);
    } catch {
      return new ExoticError(
        "Could not stringify this error",
        {
          cause: error,
        },
        inputs
      );
    }
  }
}
