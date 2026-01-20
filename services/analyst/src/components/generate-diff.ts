import { isBinary } from "#utils/is-binary";
import type { Semver } from "@es-vanguard/utils/semver";
import { createTwoFilesPatch } from "diff";

export async function generateDiff({
  targetVersion,
  baseVersion,
  targetFiles,
  baseFiles,
}: {
  targetVersion: Semver;
  baseVersion: Semver;
  targetFiles: Map<string, File>;
  baseFiles: Map<string, File>;
}) {
  let diff = "";
  const files = new Set<string>([...targetFiles.keys(), ...baseFiles.keys()]);
  for (const filePath of files.values()) {
    const binaryCheckResult = isBinary({ filePath });
    if (binaryCheckResult.isErr()) {
      console.error(binaryCheckResult.error);
      continue;
    }
    if (!binaryCheckResult.value) {
      const targetFile = targetFiles.get(filePath);
      const targetFileContent = targetFile ? await targetFile.text() : "";

      const baseFile = baseFiles.get(filePath);
      const baseFileContent = baseFile ? await baseFile.text() : "";

      if (baseFileContent === targetFileContent) {
        continue;
      }

      diff += `diff --git a/${filePath} b/${filePath}\n`;
      let fileMode = "100644";
      if (baseFileContent === "") {
        fileMode = "";
        diff += `new file mode 100644\n`;
      }
      if (targetFileContent === "") {
        fileMode = "";
        diff += `deleted file mode 100644\n`;
      }
      diff += `index v${baseVersion}..v${targetVersion} ${fileMode}\n`;
      const fileDiff = createTwoFilesPatch(
        baseFileContent ? `a/${filePath}` : "/dev/null",
        targetFileContent ? `b/${filePath}` : "/dev/null",
        baseFileContent,
        targetFileContent,
        undefined,
        undefined,
        {
          headerOptions: {
            includeIndex: true,
            includeUnderline: false,
            includeFileHeaders: true,
          },
        }
      );
      diff += fileDiff;
    } else {
      console.log(`Skipping binary file: ${filePath}`);
    }
  }
  return diff;
}
