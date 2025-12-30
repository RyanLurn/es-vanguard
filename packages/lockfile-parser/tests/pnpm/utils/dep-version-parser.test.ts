import { parsePnpmDependencyVersion } from "@/pnpm";
import { describe, test, expect } from "bun:test";
import semver from "semver";

const noPeersCase = "3.1.0";
const withPeersCase =
  "29.0.1(@typescript-eslint/eslint-plugin@6.18.1(@typescript-eslint/parser@6.18.1(eslint@8.57.1)(typescript@5.9.2))(eslint@8.57.1)(typescript@5.9.2))(eslint@8.57.1)(jest@30.0.5(@babel/types@7.28.2)(@types/node@22.15.30)(ts-node@10.9.2(@types/node@22.15.30)(typescript@5.9.2)))(typescript@5.9.2)";
/**
 * TODO: Handle patched dependencies
 * const hashPeerCase =
  "2.0.0(patch_hash=78bd3240806e30c963b9f930251eb10b9940e506f7cc8910fb3d17d7867956a2)";
 */
const workspaceCase = "link:../../packages/types";

describe("pnpm dependency version parser", () => {
  test("should parse version without peer dependencies", () => {
    const result = parsePnpmDependencyVersion(noPeersCase);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(semver.valid(result.value.version)).toBeTruthy();
    }
  });
  test("should parse version with peer dependencies", () => {
    const result = parsePnpmDependencyVersion(withPeersCase);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(semver.valid(result.value.version)).toBeTruthy();
      expect(result.value.peerDependencies).toBeTruthy();
    }
  });
  test("should reject workspace dependency", () => {
    const result = parsePnpmDependencyVersion(workspaceCase);
    expect(result.isErr()).toBe(true);
  });
});
