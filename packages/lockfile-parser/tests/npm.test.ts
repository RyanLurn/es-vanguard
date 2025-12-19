import { parseNpmLockfile } from "@/parsers/npm";
import { DependenciesSchema } from "@/schemas";
import type { ParsedDependencies } from "@/types";
import { expect, test } from "bun:test";
import npmCliCurrentLockfile from "tests/cases/npm-cli/current.json";

test("Get a list of dependencies and their exact versions from npm-cli's current lockfile", () => {
  // Check if the data shape is right
  const dependencies = parseNpmLockfile(npmCliCurrentLockfile);
  const result = DependenciesSchema.safeParse(dependencies);
  expect(result.success).toBeTrue();

  if (result.success) {
    // Check whether specific dependencies are present
    const validatedDependencies = result.data;
    const targetDependencies: ParsedDependencies = [
      {
        name: "@actions/http-client",
        version: "2.2.3",
      },
      {
        name: "@asamuzakjp/dom-selector",
        version: "6.6.1",
      },
      {
        name: "@babel/core",
        version: "7.28.4",
      },
      {
        name: "http-proxy-agent",
        version: "7.0.2",
      },
      {
        name: "import-fresh",
        version: "3.3.1",
      },
    ];

    for (const target of targetDependencies) {
      const found = validatedDependencies.find(
        (dep) => dep.name === target.name && dep.version === target.version
      );
      expect(
        found,
        `Expected to find dependency ${target.name}@${target.version} but couldn't.`
      ).toBeDefined();
    }

    // Check whether internal dependencies are ignored
    const internalDependencies = [
      "npm",
      "@npmcli/docs",
      "@npmcli/mock-globals",
      "@npmcli/mock-registry",
    ];
    for (const depName of internalDependencies) {
      const found = validatedDependencies.find((dep) => dep.name === depName);
      expect(
        found,
        `Expected internal dependency ${depName} to be filtered out but it was found.`
      ).toBeUndefined();
    }

    // Check that there are no duplicate dependencies
    const dependencySet = new Set<string>();
    for (const dep of validatedDependencies) {
      const key = `${dep.name}@${dep.version}`;
      expect(
        dependencySet.has(key),
        `Found duplicate dependency: ${key}`
      ).toBeFalse();
      dependencySet.add(key);
    }
  }
});

test("Filters out non-semver versions (git, file, etc)", () => {
  const fakeLockfile = {
    packages: {
      "": { name: "my-project" },
      "node_modules/valid-pkg": { version: "1.0.0" },
      "node_modules/git-pkg": { version: "git+ssh://github.com/user/repo.git" },
      "node_modules/local-pkg": { version: "file:../local" },
      "node_modules/weird-pkg": { version: "not-a-version" },
    },
  };

  const dependencies = parseNpmLockfile(fakeLockfile);

  expect(dependencies).toHaveLength(1);
  expect(dependencies[0]).toEqual({ name: "valid-pkg", version: "1.0.0" });
});
