import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import type { InputValues } from "@/utils/inputs/parse";
import type { Context } from "@/utils/types";
import { ValidationError } from "@es-vanguard/utils/errors/classes";
import { err, ok, Result } from "neverthrow";
import { serializeError } from "serialize-error";
import * as z from "zod";

export const ValidInputsSchema = z.strictObject({
  name: z.string(),
  target: z.string(),
  base: z.string().catch(DEFAULT_BASE_VERSION),
});

export type ValidInputs = z.infer<typeof ValidInputsSchema>;

export function validateInputs({
  inputs,
  context,
}: {
  inputs: InputValues;
  context: Context;
}): Result<
  { data: ValidInputs; context: Context },
  { error: ValidationError; context: Context }
> {
  const startTime = Bun.nanoseconds();
  const validationResult = ValidInputsSchema.safeParse(inputs);
  const endTime = Bun.nanoseconds();

  if (!validationResult.success) {
    const validationError = new ValidationError(validationResult.error);
    const newContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "validateInputs",
          order: context.steps.length + 1,
          time: {
            start: startTime,
            end: endTime,
            duration: endTime - startTime,
          },
          success: false,
          error: serializeError(validationError),
        },
      ],
    };

    return err({
      error: validationError,
      context: newContext,
    });
  }

  const newContext = {
    ...context,
    steps: [
      ...context.steps,
      {
        name: "validateInputs",
        order: context.steps.length + 1,
        time: {
          start: startTime,
          end: endTime,
          duration: endTime - startTime,
        },
        success: true,
        data: validationResult.data,
      },
    ],
  };

  return ok({
    data: validationResult.data,
    context: newContext,
  });
}
