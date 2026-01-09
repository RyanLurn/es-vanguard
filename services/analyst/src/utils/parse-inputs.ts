import { DEFAULT_BASE_VERSION } from "@/utils/constants";
import * as z from "zod";
import { parseArgs } from "util";

export const AnalystInputsSchema = z.strictObject({
  name: z.string(),
  target: z.string(),
  base: z.string().catch(DEFAULT_BASE_VERSION),
});

export type AnalystInputs = z.infer<typeof AnalystInputsSchema>;

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
}
