import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import { parseArgs } from "util";

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

  return values;
}
