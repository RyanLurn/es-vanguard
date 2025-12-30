import { ExpectedError } from "@/lib/errors";
import { parsePnpmDependency } from "@/pnpm";
import { describe, test, expect } from "bun:test";
import semver from "semver";

const noPeersCase = {
  name: "@babel/core",
  specifier: "^7.28.3",
  version: "7.28.3",
};
const withPeersCase = {
  name: "eslint-plugin-import-x",
  specifier: "^4.16.1",
  version:
    "4.16.1(@typescript-eslint/utils@8.49.0(eslint@9.39.2)(typescript@5.6.3))(eslint-import-resolver-node@0.3.9)(eslint@9.39.2)",
};
const aliasPackageCase = {
  name: "@types/pnpm__byline",
  specifier: "npm:@types/byline@^4.2.36",
  version: "4.2.36",
};
const catalogCase = {
  name: "@commitlint/prompt-cli",
  specifier: "catalog:",
  version: "19.8.1(@types/node@22.15.30)(typescript@5.9.2)",
};
const workspaceCase = {
  name: "@pnpm/eslint-config",
  specifier: "workspace:*",
  version: "link:__utils__/eslint-config",
};

describe("pnpm dependency parser", () => {
  test("should parse case with no peer dependencies", () => {
    const result = parsePnpmDependency(noPeersCase);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe("@babel/core");
      expect(semver.validRange(result.value.specifier)).toBeTruthy();
      expect(semver.valid(result.value.version)).toBe("7.28.3");
    }
  });

  test("should parse case with peer dependencies", () => {
    const result = parsePnpmDependency(withPeersCase);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe("eslint-plugin-import-x");
      expect(semver.validRange(result.value.specifier)).toBeTruthy();
      expect(semver.valid(result.value.version)).toBe("4.16.1");
      expect(result.value.peerDependencies).toBe(
        "(@typescript-eslint/utils@8.49.0(eslint@9.39.2)(typescript@5.6.3))(eslint-import-resolver-node@0.3.9)(eslint@9.39.2)"
      );
    }
  });

  test("should parse case with alias package", () => {
    const result = parsePnpmDependency(aliasPackageCase);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe("@types/byline");
      expect(result.value.specifier).toBe("npm:@types/byline@^4.2.36");
      expect(semver.valid(result.value.version)).toBe("4.2.36");
    }
  });

  test("should reject case with catalog specifier", () => {
    const result = parsePnpmDependency(catalogCase);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error instanceof ExpectedError).toBe(true);
    }
  });

  test("should reject case with workspace specifier", () => {
    const result = parsePnpmDependency(workspaceCase);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error instanceof ExpectedError).toBe(true);
    }
  });
});
