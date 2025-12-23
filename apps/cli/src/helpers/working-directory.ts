import { DEFAULT_CWD } from "@/lib/constants";
import { $ } from "bun";
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

async function checkGitInCwd({
  cwd,
}: {
  cwd: string;
}): Promise<Result<string, Error>> {
  try {
    await $`git status`.cwd(cwd).quiet();
    return ok(cwd);
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

async function validateCwd({
  cwd,
}: {
  cwd: string;
}): Promise<Result<string, Error>> {
  try {
    if (cwd === DEFAULT_CWD) {
      const defaultCwd = process.cwd();

      const checkGitInCwdResult = await checkGitInCwd({ cwd: defaultCwd });
      if (checkGitInCwdResult.isErr()) {
        return checkGitInCwdResult;
      }

      return ok(defaultCwd);
    }

    const checkCwdExistsResult = await checkCwdExists({ cwd });
    if (checkCwdExistsResult.isErr()) {
      return checkCwdExistsResult;
    }

    const checkGitInCwdResult = await checkGitInCwd({ cwd });
    if (checkGitInCwdResult.isErr()) {
      return checkGitInCwdResult;
    }

    return ok(cwd);
  } catch (error) {
    const errorMessage = `Unexpected error occurred while validating ${cwd}.`;
    console.error(errorMessage);
    console.error(error);
    return err(new Error(errorMessage));
  }
}

export { checkCwdExists, checkGitInCwd, validateCwd };
