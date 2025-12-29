import * as z from "zod";

export const PnpmDependencySchema = z.object({
  specifier: z.string(),
  version: z.string(),
});
export type PnpmDependency = z.infer<typeof PnpmDependencySchema>;

export const PnpmDependencyListSchema = z.record(
  z.string(),
  PnpmDependencySchema
);
export type PnpmDependencyList = z.infer<typeof PnpmDependencyListSchema>;

export const PnpmProjectSchema = z.looseObject({
  dependencies: PnpmDependencyListSchema.optional(),
  devDependencies: PnpmDependencyListSchema.optional(),
  optionalDependencies: PnpmDependencyListSchema.optional(),
});
export type PnpmProject = z.infer<typeof PnpmProjectSchema>;

export const PnpmSnapshotSchema = z.looseObject({
  dependencies: z.record(z.string(), z.string()).optional(),
  optionalDependencies: z.record(z.string(), z.string()).optional(),
  transitivePeerDependencies: z.array(z.string()).optional(),
});
export type PnpmSnapshot = z.infer<typeof PnpmSnapshotSchema>;

export const PnpmLockfileV9Schema = z.looseObject({
  lockfileVersion: z.literal("9.0"),
  catalogs: z.record(z.string(), PnpmDependencyListSchema).optional(),
  importers: z.record(z.string(), PnpmProjectSchema),
  snapshots: z.record(z.string(), PnpmSnapshotSchema),
});
export type PnpmLockfileV9 = z.infer<typeof PnpmLockfileV9Schema>;
