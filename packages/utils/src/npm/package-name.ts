import * as z from "zod";

const exclusionList = ["node_modules", "favicon.ico"];

const scopedPackagePattern = new RegExp("^(?:@([^/]+?)[/])?([^/]+?)$");

export const NpmPackageNameSchema = z
  .string()
  .min(1)
  .superRefine((value, context) => {
    if (value.startsWith(".")) {
      context.addIssue({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name cannot start with a period.",
      });
      return;
    }

    if (value.startsWith("-")) {
      context.addIssue({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name cannot start with a hyphen.",
      });
      return;
    }

    if (value.match(/^_/)) {
      context.addIssue({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name cannot start with an underscore.",
      });
      return;
    }

    if (value.trim() !== value) {
      context.addIssue({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name cannot contain leading or trailing spaces.",
      });
      return;
    }

    exclusionList.forEach((excludedName) => {
      if (value.toLowerCase() === excludedName) {
        context.addIssue({
          code: "invalid_format",
          format: "npm-package-name",
          message: `${excludedName} is not a valid package name.`,
        });
        return;
      }
    });

    if (encodeURIComponent(value) !== value) {
      const scopedPackagePatternMatch = value.match(scopedPackagePattern);
      if (scopedPackagePatternMatch) {
        const user = scopedPackagePatternMatch[1];
        const packageName = scopedPackagePatternMatch[2];

        if (packageName && packageName.startsWith(".")) {
          context.addIssue({
            code: "invalid_format",
            format: "npm-package-name",
            message: "npm package name cannot start with a period.",
          });
        }

        if (
          user &&
          packageName &&
          encodeURIComponent(user) === user &&
          encodeURIComponent(packageName) === packageName
        ) {
          return;
        }
      }

      context.addIssue({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name can only contain URL-friendly characters.",
      });
      return;
    }
  })
  .brand("npm-package-name");
export type NpmPackageName = z.infer<typeof NpmPackageNameSchema>;
