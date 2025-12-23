import { InputsSchema } from "@/helpers/schemas";
import {
  DEFAULT_BASE,
  DEFAULT_HEAD,
  DEFAULT_PACKAGE_MANAGER,
} from "@/lib/constants";
import { parseArgs } from "util";
import * as z from "zod";

function parseInputs({ enableLogging = false }: { enableLogging?: boolean }) {
  try {
    const { values } = parseArgs({
      args: Bun.argv,
      options: {
        base: {
          type: "string",
          short: "b",
          default: DEFAULT_BASE,
        },
        head: {
          type: "string",
          short: "h",
          default: DEFAULT_HEAD,
        },
        "package-manager": {
          type: "string",
          short: "pm",
          default: DEFAULT_PACKAGE_MANAGER,
        },
      },
      strict: true,
      allowPositionals: true,
    });

    const validatedValues = InputsSchema.parse(values);

    if (enableLogging) {
      console.log("Received inputs:", validatedValues);
    }

    return validatedValues;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Invalid input arguments.");
    }
    if (error instanceof z.ZodError) {
      console.error("Invalid input arguments:");
      console.error(z.prettifyError(error));
    }
    console.error(error);
    process.exit(1);
  }
}

export { parseInputs };
