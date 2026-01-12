import { parseArgs } from "util";
import { err, ok, Result } from "neverthrow";
import { CustomError } from "@es-vanguard/telemetry/errors/classes";
import { DEFAULT_BASE_VERSION } from "#utils/constants";
import { createFallbackError } from "@es-vanguard/telemetry/errors/fallback";

export type Inputs = {
  name?: string | undefined;
  target?: string | undefined;
  base: string;
};

export async function parseInputs(): Promise<Result<Inputs, CustomError>> {
  const args = Bun.argv;
  const options = {
    name: {
      type: "string",
    },
    target: {
      type: "string",
    },
    base: {
      type: "string",
      default: DEFAULT_BASE_VERSION,
    },
  } as const;
  const context = {
    expected: options,
    received: args,
  };

  try {
    const { values } = parseArgs({
      args,
      options,
      strict: true,
      allowPositionals: true,
    });

    return ok(values);
  } catch (error) {
    if (error instanceof TypeError) {
      const expectedTypeError = new CustomError("Invalid input arguments.", {
        cause: error,
        code: "INVALID_COMMAND_LINE_ARGUMENTS",
        expected: true,
        context,
      });

      return err(expectedTypeError);
    }

    const fallbackError = createFallbackError({ error, context });
    return err(fallbackError);
  }
}
