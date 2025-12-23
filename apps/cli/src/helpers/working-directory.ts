import { $ } from "bun";
import { stat } from "fs/promises";
import { err, ok, Result } from "neverthrow";

async function checkCwdExists({
  cwd,
}: {
  cwd: string;
}): Promise<Result<void, Error>> {
  try {
    const cwdStats = await stat(cwd);
    if (cwdStats.isDirectory()) {
      return ok();
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

async function checkGitInCwd({
  cwd,
}: {
  cwd: string;
}): Promise<Result<void, Error>> {
  try {
    await $`git status`.cwd(cwd).quiet();
    return ok();
  } catch (error) {
    if (error instanceof $.ShellError) {
      const errorMessage = `${cwd} is not a git repository.`;
      console.error(errorMessage);
      return err(new Error(errorMessage));
    }

    const errorMessage = `Unexpected error occurred while checking if ${cwd} is a git repository.`;
    console.error(errorMessage);
    console.error(error);
    return err(new Error(errorMessage));
  }
}

export { checkCwdExists, checkGitInCwd };
