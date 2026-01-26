import * as z from "zod";

export const PackageJsonScriptsSchema = z.looseObject({
  preinstall: z.string().optional(),
  install: z.string().optional(),
  postinstall: z.string().optional(),
  prepublish: z.string().optional(),
  prepublishOnly: z.string().optional(),
  preprepare: z.string().optional(),
  prepare: z.string().optional(),
  postprepare: z.string().optional(),
  prepack: z.string().optional(),
  postpack: z.string().optional(),
  dependencies: z.string().optional(),
});

export const PackageJsonBinSchema = z.union([
  z.string(),
  z.record(z.string(), z.string()),
]);

export const PackageJsonConditionalExportSchema = z.looseObject({
  types: z.string().optional(),
  "node-addons": z.string().optional(),
  node: z.string().optional(),
  browser: z.string().optional(),
  development: z.string().optional(),
  production: z.string().optional(),
  import: z.string().optional(),
  require: z.string().optional(),
  "module-sync": z.string().optional(),
  default: z.string().optional(),
});

export const PackageJsonExportsSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.looseObject({}),
]);

export const PackageJsonSchema = z.looseObject({
  name: z.string(),
  version: z.string(),
  scripts: PackageJsonScriptsSchema.optional(),
  bin: PackageJsonBinSchema.optional(),
  files: z.array(z.string()).optional(),
  main: z.string().default("index.js"),
  exports: PackageJsonExportsSchema.optional(),
  type: z.string().default("commonjs"),
  browser: z.string().optional(),
  gypfile: z.boolean().optional(),
  overrides: z.looseObject({}).optional(),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
  peerDependencies: z.record(z.string(), z.string()).optional(),
  peerDependenciesMeta: z
    .record(z.string(), z.object({ optional: z.boolean().optional() }))
    .optional(),
  bundleDependencies: z.record(z.string(), z.string()).optional(),
});

export type PackageJson = z.infer<typeof PackageJsonSchema>;
