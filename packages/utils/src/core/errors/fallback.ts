import { ExoticError, UnexpectedError } from "@/core/errors/classes";

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
