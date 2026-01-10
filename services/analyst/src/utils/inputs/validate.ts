import type { LogStep } from "@/contexts";
import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import type { InputValues, ParseInputsContext } from "@/utils/inputs/parse";
import { ValidationError } from "@es-vanguard/utils/errors/classes";
import { NpmPackageNameSchema } from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";
import { err, ok, Result } from "neverthrow";
import { serializeError } from "serialize-error";
import * as z from "zod";

export const ValidInputsSchema = z.strictObject({
  name: NpmPackageNameSchema,
  target: SemverSchema,
  base: z.union([SemverSchema, z.literal(DEFAULT_BASE_VERSION)]),
});

export type ValidInputs = z.infer<typeof ValidInputsSchema>;

type ValidateInputsStep = LogStep<"validate-inputs", ValidInputs>;

export interface ValidateInputsContext extends Omit<
  ParseInputsContext,
  "steps"
> {
  steps: [...ParseInputsContext["steps"], ValidateInputsStep];
}

export function validateInputs({
  inputs,
  context,
}: {
  inputs: InputValues;
  context: ParseInputsContext;
}): Result<
  { data: ValidInputs; context: ValidateInputsContext },
  { error: ValidationError; context: ValidateInputsContext }
> {
  const startTime = Bun.nanoseconds();
  const validationResult = ValidInputsSchema.safeParse(inputs);
  const endTime = Bun.nanoseconds();

  if (!validationResult.success) {
    const validationError = new ValidationError(validationResult.error);
    const newContext: ValidateInputsContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "validate-inputs",
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

  const newContext: ValidateInputsContext = {
    ...context,
    steps: [
      ...context.steps,
      {
        name: "validate-inputs",
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
