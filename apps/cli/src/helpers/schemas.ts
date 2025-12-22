import * as z from "zod";

const InputsSchema = z.object({
  base: z.string(),
  head: z.string(),
  runtime: z.enum(["node", "deno", "bun", "auto"]),
  "package-manager": z.enum(["npm", "yarn", "pnpm", "deno", "bun", "auto"]),
});

export { InputsSchema };
