import { serializeError, type ErrorObject } from "serialize-error";
import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import { parseArgs } from "util";
import { err, ok, Result } from "neverthrow";
import type { Context } from "@/utils/types";

export async function parseInputs({ context }: { context: Context }) {
  const startTime = Bun.nanoseconds();

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

    const endTime = Bun.nanoseconds();
    const newContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "parseInputs",
          order: context.steps.length + 1,
          time: {
            start: startTime,
            end: endTime,
            duration: endTime - startTime,
          },
          success: true,
          data: values,
        },
      ],
    };

    return ok({
      data: values,
      context: newContext,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      return err({
        error: error,
        context: {
          parseInputs: {
            success: false,
            error: {
              ...serializeError(error),
              expected: true,
              unknown: false,
            },
          },
        },
      });
    } else if (error instanceof Error) {
      return err({
        error: error,
        context: {
          parseInputs: {
            success: false,
            error: {
              ...serializeError(error),
              expected: false,
              unknown: true,
            },
          },
        },
      });
    } else {
      return err({
        error: new Error("Unknown error", { cause: error }),
        context: {
          parseInputs: {
            success: false,
            error: {
              ...serializeError(new Error("Unknown error", { cause: error })),
              expected: false,
              unknown: true,
            },
          },
        },
      });
    }
  }
}
