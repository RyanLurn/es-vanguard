import { serializeError } from "serialize-error";
import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import { parseArgs } from "util";
import { err, ok, Result } from "neverthrow";
import { ExpectedError } from "@es-vanguard/utils/errors/classes";
import { createFallbackError } from "@es-vanguard/utils/errors/fallback";
import type { LogStep, StartContext } from "@/contexts";

export type InputValues = {
  name?: string | undefined;
  target?: string | undefined;
  base: string;
};

type ParseInputsStep = LogStep<"parse-inputs", InputValues>;

export interface ParseInputsContext extends Omit<StartContext, "steps"> {
  steps: [ParseInputsStep];
}

export async function parseInputs({
  context,
}: {
  context: StartContext;
}): Promise<
  Result<
    {
      data: InputValues;
      context: ParseInputsContext;
    },
    { error: Error; context: ParseInputsContext }
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
    const newContext: ParseInputsContext = {
      ...context,
      steps: [
        {
          name: "parse-inputs",
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
      const newContext: ParseInputsContext = {
        ...context,
        steps: [
          {
            name: "parse-inputs",
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
    const newContext: ParseInputsContext = {
      ...context,
      steps: [
        {
          name: "parse-inputs",
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
