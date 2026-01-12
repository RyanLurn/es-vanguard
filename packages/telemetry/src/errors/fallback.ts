import { CustomError, type CustomErrorOptions } from "#errors/classes";

interface CreateFallbackErrorParams extends Pick<
  CustomErrorOptions,
  "context"
> {
  error: unknown;
}

export function createFallbackError({
  error,
  context,
}: CreateFallbackErrorParams) {
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
