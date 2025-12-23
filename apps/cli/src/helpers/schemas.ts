import { SUPPORTED_PMS } from "@/lib/constants";
import * as z from "zod";

const PackageManagerSchema = z.enum(SUPPORTED_PMS);

const InputsSchema = z.object({
  cwd: z.string(),
  base: z.string(),
  head: z.string(),
  pm: z.enum([...SUPPORTED_PMS, "auto"]).catch((ctx) => {
    console.log("Invalid package manager option:", ctx.value);
    console.log("ES Vanguard will auto-detect your project's package manager.");
    return "auto" as const;
  }),
});

export { InputsSchema, PackageManagerSchema };
