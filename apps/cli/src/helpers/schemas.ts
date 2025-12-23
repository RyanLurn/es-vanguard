import { SUPPORTED_PACKAGE_MANAGERS } from "@/lib/constants";
import * as z from "zod";

const PackageManagerSchema = z.enum(SUPPORTED_PACKAGE_MANAGERS);

const InputsSchema = z.object({
  base: z.string(),
  head: z.string(),
  "package-manager": z
    .enum([...SUPPORTED_PACKAGE_MANAGERS, "auto"])
    .catch((ctx) => {
      console.log("Invalid package manager option:", ctx.value);
      console.log(
        "ES Vanguard will auto-detect your project's package manager."
      );
      return "auto" as const;
    }),
});

export { InputsSchema, PackageManagerSchema };
