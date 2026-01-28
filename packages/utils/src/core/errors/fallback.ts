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

export function createFallbackError(error: unknown) {
  if (error instanceof Error) {
    return new UnexpectedError(error.message, { cause: error });
  }

  try {
    return new ExoticError(JSON.stringify(error), { cause: error });
  } catch {
    try {
      return new ExoticError(String(error), { cause: error });
    } catch {
      return new ExoticError("Could not stringify this error", {
        cause: error,
      });
    }
  }
}
