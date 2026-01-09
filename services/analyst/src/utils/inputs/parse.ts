import { serializeError, type ErrorObject } from "serialize-error";
import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import { parseArgs } from "util";
import { err, ok, Result } from "neverthrow";
import type { Context } from "@/utils/types";
import { ExpectedError } from "@es-vanguard/utils/errors/classes";
import { createFallbackError } from "@es-vanguard/utils/errors/fallback";

export async function parseInputs({ context }: { context: Context }): Promise<
  Result<
    {
      data: {
        name?: string | undefined;
        target?: string | undefined;
        base: string;
      };
      context: Context;
    },
    { error: Error; context: Context }
  >
> {
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
    const endTime = Bun.nanoseconds();
    if (error instanceof TypeError) {
      const expectedError = new ExpectedError("Invalid command line inputs", {
        cause: error,
      });
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
            success: false,
            error: serializeError(expectedError),
          },
        ],
      };

      return err({
        error: expectedError,
        context: newContext,
      });
    }

    const fallbackError = createFallbackError(error);
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
          success: false,
          error: serializeError(fallbackError),
        },
      ],
    };

    return err({
      error: fallbackError,
      context: newContext,
    });
  }
}
