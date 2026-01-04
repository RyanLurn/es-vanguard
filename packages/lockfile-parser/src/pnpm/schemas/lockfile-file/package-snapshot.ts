/**
 * The content of this file is based on pnpm's lockfile type definitions.
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts
 */

import * as z from "zod";

/**
 * From @pnpm/lockfile.types source code:
 * @example
 * {
 *   "foo": "registry.npmjs.org/foo/1.0.1"
 * }
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts#L161
 */
export const PnpmResolvedDependenciesSchema = z.record(z.string(), z.string());
export type PnpmResolvedDependencies = z.infer<
  typeof PnpmResolvedDependenciesSchema
>;

export const PnpmLockfilePackageSnapshotSchema = z.object({
  optional: z.literal(true).optional(),
  dependencies: PnpmResolvedDependenciesSchema.optional(),
  optionalDependencies: PnpmResolvedDependenciesSchema.optional(),
  transitivePeerDependencies: z.array(z.string()).optional(),
});
export type PnpmLockfilePackageSnapshot = z.infer<
  typeof PnpmLockfilePackageSnapshotSchema
>;
