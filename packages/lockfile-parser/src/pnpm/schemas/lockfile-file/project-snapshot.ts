/**
 * The content of this file is based on pnpm's lockfile type definitions.
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/lockfileFileTypes.ts
 */

import { PnpmDependenciesMetaSchema } from "@/pnpm/schemas/others";

import * as z from "zod";

export const PnpmProjectSnapshotBaseSchema = z.object({
  dependenciesMeta: PnpmDependenciesMetaSchema.optional(),
  publishDirectory: z.string().optional(),
});
export type PnpmProjectSnapshotBase = z.infer<
  typeof PnpmProjectSnapshotBaseSchema
>;

export const PnpmSpecifierAndResolutionSchema = z.object({
  specifier: z.string(),
  version: z.string(),
});
export type PnpmSpecifierAndResolution = z.infer<
  typeof PnpmSpecifierAndResolutionSchema
>;

export const PnpmLockfileFileProjectResolvedDependenciesSchema = z.record(
  z.string(),
  PnpmSpecifierAndResolutionSchema
);
export type PnpmLockfileFileProjectResolvedDependencies = z.infer<
  typeof PnpmLockfileFileProjectResolvedDependenciesSchema
>;

export const PnpmLockfileFileProjectSnapshotSchema = z.object({
  ...PnpmProjectSnapshotBaseSchema.shape,
  dependencies: PnpmLockfileFileProjectResolvedDependenciesSchema.optional(),
  devDependencies: PnpmLockfileFileProjectResolvedDependenciesSchema.optional(),
  optionalDependencies:
    PnpmLockfileFileProjectResolvedDependenciesSchema.optional(),
});
export type PnpmLockfileFileProjectSnapshot = z.infer<
  typeof PnpmLockfileFileProjectSnapshotSchema
>;
