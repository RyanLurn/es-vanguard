import { PackageJsonSchema } from "#components/static-analysis/package-json";
import { structuredPatch } from "diff";
import * as z from "zod";

const basePackageJson = {
  name: "test",
  version: "1.0.0",
  dependencies: {
    react: "18.0.0",
  },
  gypfile: false,
};
const targetPackageJson = {
  name: "test",
  version: "1.0.0",
  scripts: {
    postinstall: "node postinstall.js",
  },
  dependencies: {
    react: "19.0.0",
    "react-dom": "19.0.0",
  },
};

// const patch = structuredPatch(
//   "package.json",
//   "package.json",
//   JSON.stringify(basePackageJson, null, 2),
//   JSON.stringify(targetPackageJson, null, 2),
//   undefined,
//   undefined,
//   {
//     ignoreWhitespace: true,
//   }
// );

// for (const hunk of patch.hunks) {
//   for (const line of hunk.lines) {
//     if (line.startsWith("+")) {
//       console.log("Added:", line);
//     }
//   }
// }

const jsonString = JSON.stringify(basePackageJson, null, 2);
console.log(jsonString);
const parsed = JSON.parse(jsonString);
console.log(parsed);
const booleanResult = z.boolean().parse(parsed.gypfile);
console.log(booleanResult);
