import { parseArgs } from "util";

const DEFAULT_BASE = "main";
const DEFAULT_HEAD = "HEAD";

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
      },
      strict: true,
      allowPositionals: true,
    });

    if (enableLogging) {
      console.log("Received inputs:", values);
    }

    return values;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Invalid input arguments.");
    }
    console.error(error);
    process.exit(1);
  }
}

export { parseInputs };
