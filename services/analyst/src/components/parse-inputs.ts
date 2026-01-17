import { parseArgs } from "util";
import { err, ok, Result } from "neverthrow";
import { DEFAULT_BASE_VERSION } from "#utils/constants";
import { createFallbackError } from "@es-vanguard/telemetry/errors/fallback";
import { NpmPackageNameSchema } from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";
import * as z from "zod";

export const InputsSchema = z.strictObject({
  name: NpmPackageNameSchema,
  target: SemverSchema,
  base: z.union([SemverSchema, z.literal(DEFAULT_BASE_VERSION)]),
});
export type Inputs = z.infer<typeof InputsSchema>;

export async function parseInputs() {
  try {
    const { values } = parseArgs({
      args: Bun.argv,
      options: {
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
      },
      strict: true,
      allowPositionals: true,
    });

    const validationResult = InputsSchema.safeParse(values);

    if (!validationResult.success) {
      return err(validationResult.error);
    }

    return ok(validationResult.data);
  } catch (error) {
    if (error instanceof TypeError) {
      return err(error);
    }

    const fallbackError = createFallbackError({ error });
    return err(fallbackError);
  }
}
