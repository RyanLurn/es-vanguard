import { ExoticError } from "@/core/errors/classes";

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  try {
    return new ExoticError(JSON.stringify(error), { cause: error });
  } catch {
    try {
      return new ExoticError(String(error), { cause: error });
    } catch {
      return new ExoticError("Could not stringify this exotic error", {
        cause: error,
      });
    }
  }
}
