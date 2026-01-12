import { CustomError, type CustomErrorOptions } from "#errors/classes";

export function createFallbackError({
  error,
  context,
}: {
  error: unknown;
  context?: Pick<CustomErrorOptions, "context">;
}) {
  const exoticErrorOptions: CustomErrorOptions = {
    cause: error,
    code: "EXOTIC_ERROR",
    expected: false,
    context,
  };

  if (error instanceof Error) {
    return new CustomError(error.message, {
      ...exoticErrorOptions,
      code: "UNEXPECTED_ERROR",
    });
  }

  try {
    return new CustomError(JSON.stringify(error), exoticErrorOptions);
  } catch {
    try {
      return new CustomError(String(error), exoticErrorOptions);
    } catch {
      return new CustomError(
        "Could not stringify this error",
        exoticErrorOptions
      );
    }
  }
}
