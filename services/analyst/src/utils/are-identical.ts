import type { SkippedIdenticalFile } from "#utils/types/skipped-file";

export async function areFilesIdentical({
  targetFile,
  baseFile,
  filePath,
}: {
  targetFile: File | undefined;
  baseFile: File | undefined;
  filePath: string;
}): Promise<SkippedIdenticalFile | undefined> {
  if (targetFile && baseFile) {
    const targetFileHash = Bun.hash.xxHash3(await targetFile.arrayBuffer());
    const baseFileHash = Bun.hash.xxHash3(await baseFile.arrayBuffer());
    if (targetFileHash === baseFileHash) {
      const report: SkippedIdenticalFile = {
        path: filePath,
        category: "identical",
        reason: "hash",
      };
      return report;
    }
  }

  return undefined;
}

export function areContentIdentical({
  targetFileContent,
  baseFileContent,
  filePath,
}: {
  targetFileContent: string;
  baseFileContent: string;
  filePath: string;
}): SkippedIdenticalFile | undefined {
  if (targetFileContent === baseFileContent) {
    const report: SkippedIdenticalFile = {
      path: filePath,
      category: "identical",
      reason: "text",
    };
    return report;
  }

  return undefined;
}
