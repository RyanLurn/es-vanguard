import { parseNpmLockfile } from "@/parsers/npm";
import { DependenciesSchema } from "@/schemas";
import { getNpmLockfileFixture } from "tests/helpers";
import { expect, test, describe, beforeAll } from "bun:test";

describe("parseNpmLockfile (npm-cli)", () => {
  let lockfileData: Record<string, any>;
  let parsedResult: ReturnType<typeof parseNpmLockfile>;

  // 1. SETUP: Run once before all tests
  beforeAll(async () => {
    lockfileData = await getNpmLockfileFixture();
    parsedResult = parseNpmLockfile(lockfileData);
  });

  // 2. ASSERTIONS

  test("Returns valid schema structure", () => {
    const result = DependenciesSchema.safeParse(parsedResult);
    expect(result.success).toBe(true);
  });

  test("Extracts specific external dependencies correctly", () => {
    const targets = [
      { name: "@actions/http-client", version: "2.2.3" },
      { name: "@asamuzakjp/dom-selector", version: "6.6.1" },
      { name: "@babel/core", version: "7.28.4" },
      { name: "http-proxy-agent", version: "7.0.2" },
      { name: "import-fresh", version: "3.3.1" },
    ];

    for (const target of targets) {
      const found = parsedResult.find(
        (dep) => dep.name === target.name && dep.version === target.version
      );
      expect(found).toBeDefined();
    }
  });

  test("Filters out internal workspaces/packages", () => {
    const internalDependencies = [
      "npm",
      "@npmcli/docs",
      "@npmcli/mock-globals",
      "@npmcli/mock-registry",
    ];

    for (const name of internalDependencies) {
      const found = parsedResult.find((dep) => dep.name === name);
      expect(found).toBeUndefined();
    }
  });

  test("Deduplicates dependencies", () => {
    const seen = new Set<string>();
    for (const dep of parsedResult) {
      const key = `${dep.name}@${dep.version}`;
      expect(seen.has(key)).toBeFalse(); // Should not have seen this before
      seen.add(key);
    }
  });
});

// Keep the unit test for edge cases separate
test("Unit: Filters out non-semver versions", () => {
  const fakeLockfile = {
    packages: {
      "": { name: "my-project" },
      "node_modules/valid-pkg": { version: "1.0.0" },
      "node_modules/git-pkg": { version: "git+ssh://github.com/user/repo.git" },
      "node_modules/weird-pkg": { version: "not-a-version" },
    },
  };

  const dependencies = parseNpmLockfile(fakeLockfile);
  expect(dependencies).toHaveLength(1);
  expect(dependencies[0]).toEqual({ name: "valid-pkg", version: "1.0.0" });
});
