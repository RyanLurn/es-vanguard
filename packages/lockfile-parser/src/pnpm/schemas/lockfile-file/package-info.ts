/**
 * The content of this file is based on pnpm's lockfile type definitions.
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts
 */

import { PnpmLockfileResolutionSchema } from "@/pnpm/schemas/lockfile-resolution";

import * as z from "zod";

export const PnpmLockfilePackageInfoSchema = z.object({
  id: z.string().optional(),
  patched: z.boolean().optional(),
  hasBin: z.boolean().optional(),
  /**
   * From @pnpm/lockfile.types source code:
   * "name and version are only needed for packages that are hosted not in the npm registry"
   * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts#L44
   */
  name: z.string().optional(),
  version: z.string().optional(),
  resolution: PnpmLockfileResolutionSchema,
  peerDependencies: z.record(z.string(), z.string()).optional(),
  peerDependenciesMeta: z
    .record(
      z.string(),
      z.object({
        optional: z.literal(true),
      })
    )
    .optional(),
  bundledDependencies: z.union([z.array(z.string()), z.boolean()]).optional(),
  engines: z
    .intersection(
      z.record(z.string(), z.string()),
      z.object({
        node: z.string(),
      })
    )
    .optional(),
  os: z.array(z.string()).optional(),
  cpu: z.array(z.string()).optional(),
  libc: z.array(z.string()).optional(),
  deprecated: z.string().optional(),
});
export type PnpmLockfilePackageInfo = z.infer<
  typeof PnpmLockfilePackageInfoSchema
>;
