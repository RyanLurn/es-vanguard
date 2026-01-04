import * as z from "zod";

/**
 * Common schema for a dependency map (dependencies, devDependencies, etc.)
 * Maps package name -> version specifier
 */
const DependencyMap = z.record(z.string(), z.string());

/**
 * Funding information can be a string, an object, or an array of those.
 * Reference: @npmcli/arborist/lib/node.js processing of package.json
 */
const FundingSource = z.union([
  z.string(),
  z.object({
    type: z.string().optional(),
    url: z.string(),
  }),
]);

const FundingSchema = z.union([FundingSource, z.array(FundingSource)]);

/**
 * Binaries can be a single string (mapped to package name) or a map.
 */
const BinSchema = z.union([z.string(), z.record(z.string(), z.string())]);

/**
 * Schema for a single entry in the "packages" object.
 *
 * RELAXED SCHEMA NOTE:
 * Based on feedback from real-world testing, many fields like 'engines' and 'license'
 * often contain legacy formats (arrays instead of objects/strings) in older packages.
 * We use z.any() or broader unions for non-critical metadata to prevent parser crashes.
 */
const NpmPackageSchema = z.object({
  // Package Metadata (mirrored from package.json)
  name: z.string().optional(),
  version: z.string().optional(),

  // Relaxed License: Can be string, object, or array of either (legacy)
  license: z
    .union([
      z.string(),
      z.object({ type: z.string().optional() }), // Relaxed object shape
      z.array(z.union([z.string(), z.record(z.string(), z.unknown())])),
    ])
    .optional(),

  // Dependency Graphs
  dependencies: DependencyMap.optional(),
  devDependencies: DependencyMap.optional(),
  peerDependencies: DependencyMap.optional(),
  peerDependenciesMeta: z
    .record(z.string(), z.object({ optional: z.boolean().optional() }))
    .optional(),
  optionalDependencies: DependencyMap.optional(),
  bundleDependencies: z.union([z.array(z.string()), z.boolean()]).optional(),

  // Resolution & Integrity (Security Critical - Kept Strict)
  resolved: z.string().optional(),
  integrity: z.string().optional(),

  // Node Flags (Arborist logic)
  link: z.boolean().optional(), // Is this a symlink?
  dev: z.boolean().optional(), // Is this a dev dependency?
  optional: z.boolean().optional(), // Is this an optional dependency?
  devOptional: z.boolean().optional(), // Is this a dev dependency of an optional dependency?
  inBundle: z.boolean().optional(), // Is this a bundled dependency?
  hasInstallScript: z.boolean().optional(), // Does it run scripts? (Important for security)
  hasShrinkwrap: z.boolean().optional(),

  // Environment Constraints
  // Relaxed Engines: Can be record OR array of strings (legacy)
  engines: z
    .union([z.record(z.string(), z.string()), z.array(z.string())])
    .optional(),

  os: z.array(z.string()).optional(),
  cpu: z.array(z.string()).optional(),

  // Misc
  bin: BinSchema.optional(),
  funding: FundingSchema.optional(),
  deprecated: z.string().optional(),
});

/**
 * The Root Lockfile Schema (v2 & v3)
 * Reference: @npmcli/arborist/lib/shrinkwrap.js
 */
const NpmLockfileSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),

  // We strictly support v2 and v3. v1 is legacy (no 'packages' key).
  lockfileVersion: z.union([z.literal(2), z.literal(3)]),

  // The 'packages' object is the source of truth for v2/v3.
  // Keys are file paths relative to root (e.g. "", "node_modules/foo").
  packages: z.record(z.string(), NpmPackageSchema),

  // Legacy support: exists in v2 for backwards compatibility with v1 clients.
  // We generally ignore this in favor of 'packages', but we define it to avoid stripping it implicitly if we ever need to write back.
  dependencies: z.record(z.string(), z.any()).optional(),
});

type NpmLockfile = z.infer<typeof NpmLockfileSchema>;
type NpmPackage = z.infer<typeof NpmPackageSchema>;

export { NpmLockfileSchema, NpmPackageSchema };
export type { NpmLockfile, NpmPackage };
