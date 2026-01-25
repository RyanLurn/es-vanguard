export async function areDifferent({
  targetFile,
  baseFile,
}: {
  targetFile: File | undefined;
  baseFile: File | undefined;
}) {
  if (targetFile && baseFile) {
    const targetFileHash = Bun.hash.xxHash3(await targetFile.arrayBuffer());
    const baseFileHash = Bun.hash.xxHash3(await baseFile.arrayBuffer());
    return targetFileHash !== baseFileHash;
  }

  return true;
}
