import { DEFAULT_CWD } from "@/lib/constants";
import { $ } from "bun";
import { stat } from "fs/promises";
import { err, ok, Result } from "neverthrow";
import * as z from "zod";

const DirectoryPathSchema = z.string().brand<"DirectoryPath">(); // Absolute path to a directory
const GitRepoPathSchema = DirectoryPathSchema.brand<"GitRepoPath">(); // Absolute path to a git repository

type DirectoryPath = z.infer<typeof DirectoryPathSchema>;
type GitRepoPath = z.infer<typeof GitRepoPathSchema>;

async function checkCwdExists({
  cwdInput,
}: {
  cwdInput: string;
}): Promise<Result<DirectoryPath, Error>> {
  try {
    const cwdStats = await stat(cwdInput);
    if (cwdStats.isDirectory()) {
      const cwd = DirectoryPathSchema.parse(cwdInput);
      return ok(cwd);
    }

    const errorMessage = `${cwdInput} is a path to a file, not a directory.`;
    console.error(errorMessage);
    return err(new Error(errorMessage));
  } catch (error) {
    const errorMessage = `${cwdInput} does not exist on your file system.`;
    console.error(errorMessage);
    console.error(error);
    return err(new Error(errorMessage));
  }
}

async function checkGitInCwd({
  cwd,
}: {
  cwd: DirectoryPath;
}): Promise<Result<GitRepoPath, Error>> {
  try {
    await $`git status`.cwd(cwd).quiet();
    const gitRepoPath = GitRepoPathSchema.parse(cwd);
    return ok(gitRepoPath);
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

async function validateCwdInput({
  cwdInput,
}: {
  cwdInput: string;
}): Promise<Result<GitRepoPath, Error>> {
  try {
    if (cwdInput === DEFAULT_CWD) {
      const defaultCwd = DirectoryPathSchema.parse(process.cwd());

      const checkGitInCwdResult = await checkGitInCwd({ cwd: defaultCwd });
      if (checkGitInCwdResult.isErr()) {
        return checkGitInCwdResult;
      }

      return ok(checkGitInCwdResult.value);
    }

    const checkCwdExistsResult = await checkCwdExists({ cwdInput });
    if (checkCwdExistsResult.isErr()) {
      return err(checkCwdExistsResult.error);
    }

    const cwd = checkCwdExistsResult.value;

    const checkGitInCwdResult = await checkGitInCwd({ cwd });
    if (checkGitInCwdResult.isErr()) {
      return checkGitInCwdResult;
    }

    return ok(checkGitInCwdResult.value);
  } catch (error) {
    const errorMessage = `Unexpected error occurred while validating ${cwdInput}.`;
    console.error(errorMessage);
    console.error(error);
    return err(new Error(errorMessage));
  }
}

export {
  DirectoryPathSchema,
  GitRepoPathSchema,
  checkCwdExists,
  checkGitInCwd,
  validateCwdInput,
};
export type { DirectoryPath, GitRepoPath };
