import * as z from "zod";

const PackageSchema = z.object({
  name: z.string(),
  version: z.string(),
});

const DependenciesSchema = z.array(PackageSchema);

export { PackageSchema, DependenciesSchema };
