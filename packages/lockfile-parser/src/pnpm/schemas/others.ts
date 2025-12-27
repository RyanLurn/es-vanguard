import * as z from "zod";

/**
 * @see https://github.com/pnpm/pnpm/blob/main/patching/types/src/index.ts#L1
 */
export const PnpmPatchFileSchema = z.object({
  path: z.string(),
  hash: z.string(),
});
export type PnpmPatchFile = z.infer<typeof PnpmPatchFileSchema>;

/**
 * @see https://github.com/pnpm/pnpm/blob/main/packages/types/src/package.ts#L49
 */
export const PnpmDependenciesMetaSchema = z.record(
  z.string(),
  z.object({
    injected: z.boolean().optional(),
    node: z.string().optional(),
    path: z.string().optional(),
    /**
     * This field doesn't exist in DependenciesMeta interface according to pnpm's type definitions
     * However, in our tests, we found some edge cases where it does exist
     * @see https://github.com/angular/angular-cli/blob/main/pnpm-lock.yaml#L18
     * @see https://github.com/angular/angular-cli/blob/main/pnpm-lock.yaml#L20
     */
    built: z.boolean().optional(),
  })
);
export type PnpmDependenciesMeta = z.infer<typeof PnpmDependenciesMetaSchema>;

/**
 * @see https://github.com/pnpm/pnpm/blob/main/resolving/resolver-base/src/index.ts#L51
 */
export const PnpmPlatformAssetTargetSchema = z.object({
  os: z.string(),
  cpu: z.string(),
  libc: z.literal("musl").optional(),
});
export type PnpmPlatformAssetTarget = z.infer<
  typeof PnpmPlatformAssetTargetSchema
>;
