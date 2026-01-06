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
    }

    if (value.startsWith("-")) {
      context.addIssue({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name cannot start with a hyphen.",
      });
    }

    if (value.match(/^_/)) {
      context.addIssue({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name cannot start with an underscore.",
      });
    }

    if (value.trim() !== value) {
      context.addIssue({
        code: "invalid_format",
        format: "npm-package-name",
        message: "npm package name cannot contain leading or trailing spaces.",
      });
    }

    exclusionList.forEach((excludedName) => {
      if (value.toLowerCase() === excludedName) {
        context.addIssue({
          code: "invalid_format",
          format: "npm-package-name",
          message: `${excludedName} is not a valid package name.`,
        });
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
    }
  })
  .brand("npm-package-name");
export type NpmPackageName = z.infer<typeof NpmPackageNameSchema>;
