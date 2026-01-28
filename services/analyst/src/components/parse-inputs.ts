import { parseArgs } from "util";
import { err, ok, Result } from "neverthrow";
import { DEFAULT_BASE_VERSION } from "#utils/constants";
import {
  serializeUnknown,
  type SerializedFallback,
} from "@es-vanguard/telemetry/errors/serialize-unknown";
import { NpmPackageNameSchema } from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";
import * as z from "zod";
import { semver } from "bun";

export const InputsSchema = z
  .strictObject({
    name: NpmPackageNameSchema.trim(),
    target: SemverSchema.trim(),
    base: z.union([SemverSchema.trim(), z.literal(DEFAULT_BASE_VERSION)]),
  })
  .refine(
    ({ target, base }) => {
      if (base === "previous") {
        return true;
      }
      if (semver.order(target, base) === 1) {
        // This means target is > base in term of semver
        return true;
      }
      return false;
    },
    {
      error: "Base version must be less than target version",
      path: ["base"],
    }
  );
export type Inputs = z.infer<typeof InputsSchema>;

export async function parseInputs(): Promise<
  Result<Inputs, Error | SerializedFallback>
> {
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
    if (error instanceof Error) {
      return err(error);
    }

    const fallbackError = serializeUnknown(error);
    return err(fallbackError);
  }
}
