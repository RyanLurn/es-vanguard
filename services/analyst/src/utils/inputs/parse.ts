import { serializeError } from "serialize-error";
import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import { parseArgs } from "util";

export async function parseInputs() {
  try {
    const { values } = parseArgs({
      args: Bun.argv,
      options: {
        name: {
          type: "string",
          short: "n",
        },
        target: {
          type: "string",
          short: "t",
        },
        base: {
          type: "string",
          short: "b",
          default: DEFAULT_BASE_VERSION,
        },
      },
      strict: true,
      allowPositionals: true,
    });

    const successContext = {
      parseInputs: {
        success: true,
        values,
      },
    };

    return {
      inputs: values,
      context: successContext,
    };
  } catch (error) {
    if (error instanceof TypeError) {
      const typeErrorContext = {
        parseInputs: {
          success: false,
          error: {
            ...serializeError(error),
            expected: true,
            unknown: false,
          },
        },
      };
      console.error(typeErrorContext);
    } else if (error instanceof Error) {
      const unexpectedErrorContext = {
        parseInputs: {
          success: false,
          error: {
            ...serializeError(error),
            expected: false,
            unknown: false,
          },
        },
      };
      console.error(unexpectedErrorContext);
    } else {
      const unknownErrorContext = {
        parseInputs: {
          success: false,
          error: {
            name: "UnknownError",
            message: "Unknown error occurred in parseInputs function",
            expected: false,
            unknown: true,
          },
        },
      };
      console.error(unknownErrorContext);
    }
    process.exit(1);
  }
}

export type ParseInputsResult = Awaited<ReturnType<typeof parseInputs>>;
