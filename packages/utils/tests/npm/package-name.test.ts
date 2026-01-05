import { NpmPackageNameSchema, type NpmPackageName } from "@/npm/package-name";
import { describe, test, expect } from "bun:test";
import { prettifyError } from "zod";

describe("npm package name schema", () => {
  const validPackageName = "@npm-zors/money!time.js" as NpmPackageName;
  test(`should parse ${validPackageName} successfully`, () => {
    const parseResult = NpmPackageNameSchema.safeParse(validPackageName);
    expect(parseResult.success).toBe(true);

    if (!parseResult.success) {
      console.error(prettifyError(parseResult.error));
    }

    expect(parseResult.data).toBe(validPackageName);
  });

  const scopedAndStartWithPeriod = "@npm/.package";
  test(`should return error for ${scopedAndStartWithPeriod}`, () => {
    const parseResult = NpmPackageNameSchema.safeParse(
      scopedAndStartWithPeriod
    );
    expect(parseResult.success).toBe(false);

    if (!parseResult.success) {
      expect(parseResult.error.issues[0]?.message).toBe(
        "npm package name cannot start with a period."
      );
    }
  });

  const notUrlFriendly = "s/l/a/s/h/e/s";
  test(`should return error for ${notUrlFriendly}`, () => {
    const parseResult = NpmPackageNameSchema.safeParse(notUrlFriendly);
    expect(parseResult.success).toBe(false);

    if (!parseResult.success) {
      expect(parseResult.error.issues[0]?.message).toBe(
        "npm package name can only contain URL-friendly characters."
      );
    }
  });

  const leadingSpace = " leading-space";
  test(`should return error for ${leadingSpace}`, () => {
    const parseResult = NpmPackageNameSchema.safeParse(leadingSpace);
    expect(parseResult.success).toBe(false);

    if (!parseResult.success) {
      const issues = parseResult.error.issues;
      expect(issues).toHaveLength(2);
      expect(issues).toContainEqual({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name cannot contain leading or trailing spaces.",
        path: [],
      });
      expect(issues).toContainEqual({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name can only contain URL-friendly characters.",
        path: [],
      });
    }
  });
});
