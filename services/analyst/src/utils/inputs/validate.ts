import { DEFAULT_BASE_VERSION } from "#utils/constants";
import type { Inputs } from "#utils/inputs/parse";
import { CustomError } from "@es-vanguard/telemetry/errors/classes";
import { NpmPackageNameSchema } from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";
import { err, ok, Result } from "neverthrow";
import * as z from "zod";

export const ValidInputsSchema = z.strictObject({
  name: NpmPackageNameSchema,
  target: SemverSchema,
  base: z.union([SemverSchema, z.literal(DEFAULT_BASE_VERSION)]),
});
export type ValidInputs = z.infer<typeof ValidInputsSchema>;

export function validateInputs({
  inputs,
}: {
  inputs: Inputs;
}): Result<ValidInputs, CustomError> {
  const validationResult = ValidInputsSchema.safeParse(inputs);

  if (!validationResult.success) {
    const validationError = new CustomError(
      "Invalid command-line input values.",
      {
        cause: validationResult.error,
        code: "SCHEMA_VALIDATION_ERROR",
        expected: true,
        context: {
          inputs,
          issues: validationResult.error.issues,
        },
      }
    );

    return err(validationError);
  }

  return ok(validationResult.data);
}
