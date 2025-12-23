import { stat } from "fs/promises";
import { err, ok, Result } from "neverthrow";

async function checkCwdExists({
  cwd,
}: {
  cwd: string;
}): Promise<Result<string, Error>> {
  try {
    const cwdStats = await stat(cwd);
    if (cwdStats.isDirectory()) {
      return ok(cwd);
    }

    const errorMessage = `${cwd} is not a directory on your file system.`;
    console.error(errorMessage);
    return err(new Error(errorMessage));
  } catch (error) {
    const errorMessage = `Could not determine if ${cwd} is a directory on your file system.`;
    console.error(errorMessage);
    console.error(error);
    return err(new Error(errorMessage));
  }
}

export { checkCwdExists };
