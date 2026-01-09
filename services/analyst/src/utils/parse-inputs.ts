import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import { NpmPackageNameSchema } from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";
import { parseArgs } from "util";
import * as z from "zod";

const InputsSchema = z.object({
  name: NpmPackageNameSchema,
  target: SemverSchema,
  base: z.union([SemverSchema, z.literal(DEFAULT_BASE_VERSION)]),
});

export type Inputs = z.infer<typeof InputsSchema>;

export async function parseInputs() {
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

  const context = {
    parseInputs: {
      parseArgs: {
        ...values,
      },
    },
  };

  const validateArgsResult = InputsSchema.safeParse(values);
  if (!validateArgsResult.success) {
    const invalidArgsContext = {
      ...context,
      parseInputs: {
        ...context.parseInputs,
        validateArgs: {
          success: validateArgsResult.success,
          errors: validateArgsResult.error.issues,
        },
      },
    };
    console.error(invalidArgsContext);
    process.exit(1);
  }

  const validArgsContext = {
    ...context,
    parseInputs: {
      ...context.parseInputs,
      validateArgs: {
        success: validateArgsResult.success,
        data: validateArgsResult.data,
      },
    },
  };

  return {
    context: validArgsContext,
    inputs: validateArgsResult.data,
  };
}
