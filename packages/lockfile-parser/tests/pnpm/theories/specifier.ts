import { PnpmLockfileV9Schema, type PnpmDependencyList } from "@/pnpm/schema";
import { pnpmV9LockfileUrls } from "@es-vanguard/test-utilities/datasets/pnpm.ts";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import semver from "semver";
import * as z from "zod";

const allUnknownSpecifiers: string[] = [];

for (const url of pnpmV9LockfileUrls) {
  const semverRangeSpecifiers = [];
  const catalogSpecifiers = [];
  const workspaceSpecifiers = [];
  const aliasSpecifiers = [];
  const fileSpecifiers = [];
  const linkSpecifiers = [];
  const latestSpecifiers = [];
  const betaSpecifiers = [];
  const rcSpecifiers = [];
  const canarySpecifiers = [];
  const urlSpecifiers = [];
  const unknownSpecifiers = [];

  const getGithubContentResult = await getGithubContent({
    githubBlobUrl: url,
  });
  if (getGithubContentResult.isErr()) {
    throw new Error(
      `Failed to fetch ${url}: ${getGithubContentResult.error.message}`
    );
  }
  const lockfileContent = getGithubContentResult.value;

  const parseYamlResult = await safeYamlParse({
    text: lockfileContent,
    schema: PnpmLockfileV9Schema,
  });
  if (parseYamlResult.isErr()) {
    throw new Error(`Failed to parse ${url}: ${parseYamlResult.error.message}`);
  }
  const lockfile = parseYamlResult.value;

  const dependencyLists: Record<string, PnpmDependencyList> = {};

  for (const [catalogName, catalogDependencyList] of Object.entries(
    lockfile.catalogs ?? {}
  )) {
    dependencyLists[`catalogs/${catalogName}`] = catalogDependencyList;
  }
  for (const [projectName, project] of Object.entries(lockfile.importers)) {
    const { dependencies, devDependencies, optionalDependencies } = project;
    if (dependencies) {
      dependencyLists[`importers/${projectName}/dependencies`] = dependencies;
    }
    if (devDependencies) {
      dependencyLists[`importers/${projectName}/devDependencies`] =
        devDependencies;
    }
    if (optionalDependencies) {
      dependencyLists[`importers/${projectName}/optionalDependencies`] =
        optionalDependencies;
    }
  }

  for (const [_listName, dependencyList] of Object.entries(dependencyLists)) {
    for (const [_dependencyName, dependency] of Object.entries(
      dependencyList
    )) {
      const { specifier } = dependency;
      if (semver.validRange(specifier)) {
        semverRangeSpecifiers.push(specifier);
      } else if (specifier.startsWith("catalog:")) {
        catalogSpecifiers.push(specifier);
      } else if (specifier.startsWith("workspace:")) {
        workspaceSpecifiers.push(specifier);
      } else if (specifier.startsWith("npm:")) {
        aliasSpecifiers.push(specifier);
      } else if (specifier.startsWith("file:")) {
        fileSpecifiers.push(specifier);
      } else if (specifier.startsWith("link:")) {
        linkSpecifiers.push(specifier);
      } else if (specifier.startsWith("latest")) {
        latestSpecifiers.push(specifier);
      } else if (specifier.startsWith("beta")) {
        betaSpecifiers.push(specifier);
      } else if (specifier.startsWith("rc")) {
        rcSpecifiers.push(specifier);
      } else if (specifier.startsWith("canary")) {
        canarySpecifiers.push(specifier);
      } else if (z.url().safeParse(specifier).success) {
        urlSpecifiers.push(specifier);
      } else {
        unknownSpecifiers.push(specifier);
        allUnknownSpecifiers.push(specifier);
      }
    }
  }
}
