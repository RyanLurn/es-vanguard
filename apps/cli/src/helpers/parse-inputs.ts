import {
  DEFAULT_BASE,
  DEFAULT_CWD,
  DEFAULT_HEAD,
  DEFAULT_PM_OPTION,
} from "@/lib/constants";
import { parseArgs } from "util";

async function parseInputs({
  enableLogging = false,
}: {
  enableLogging?: boolean;
}) {
  try {
    const { values } = parseArgs({
      args: Bun.argv,
      options: {
        cwd: {
          type: "string",
          default: DEFAULT_CWD,
        },
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
        pm: {
          type: "string",
          default: DEFAULT_PM_OPTION,
        },
      },
      strict: true,
      allowPositionals: true,
    });

    if (enableLogging) {
      console.log("Received inputs:", values);
    }

    return {
      cwd: values.cwd,
      base: values.base,
      head: values.head,
      pm: values.pm,
    };
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Invalid input arguments.");
    }
    console.error(error);
    process.exit(1);
  }
}

type Inputs = Awaited<ReturnType<typeof parseInputs>>;

export { parseInputs };
export type { Inputs };
