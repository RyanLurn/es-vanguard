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
    const targetFile = targetFiles.get(filePath);
    const baseFile = baseFiles.get(filePath);

    const targetFileName = targetFile ? `b/${filePath}` : "/dev/null";
    const baseFileName = baseFile ? `a/${filePath}` : "/dev/null";

    if (!isBinary({ filePath })) {
      const targetFileContent = targetFile ? await targetFile.text() : "";
      const baseFileContent = baseFile ? await baseFile.text() : "";

      if (baseFileContent === targetFileContent) {
        continue;
      }

      diff += `diff --git a/${filePath} b/${filePath}\n`;
      let fileMode = "100644";
      if (!baseFile) {
        fileMode = "";
        diff += "new file mode 100644\n";
      }
      if (!targetFile) {
        fileMode = "";
        diff += "deleted file mode 100644\n";
      }
      diff += `index v${baseVersion}..v${targetVersion} ${fileMode}\n`;

      const fileDiff = createTwoFilesPatch(
        baseFileName,
        targetFileName,
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
      if (baseFile && targetFile) {
        const baseFileHash = Bun.hash.xxHash3(await baseFile.arrayBuffer());
        const targetFileHash = Bun.hash.xxHash3(await targetFile.arrayBuffer());
        if (baseFileHash === targetFileHash) {
          continue;
        }
      }

      diff += `diff --git a/${filePath} b/${filePath}\n`;
      let fileMode = "100644";
      if (!baseFile) {
        fileMode = "";
        diff += "new file mode 100644\n";
      }
      if (!targetFile) {
        fileMode = "";
        diff += "deleted file mode 100644\n";
      }
      diff += `index v${baseVersion}..v${targetVersion} ${fileMode}\n`;
      diff += `Binary files ${baseFileName} and ${targetFileName} differ\n`;
    }
  }
  return diff;
}
