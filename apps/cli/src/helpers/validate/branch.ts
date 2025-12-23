import type { GitRepoPath } from "@/helpers/validate/cwd";
import { DEFAULT_HEAD } from "@/lib/constants";
import { $ } from "bun";
import { err, ok, type Result } from "neverthrow";
import * as z from "zod";

const GitBranchSchema = z.string().brand<"GitBranch">();

type GitBranch = z.infer<typeof GitBranchSchema>;

async function validateBranchInput({
  gitRepoPath,
  branchInput,
}: {
  gitRepoPath: GitRepoPath;
  branchInput: string;
}): Promise<Result<GitBranch, Error>> {
  try {
    if (branchInput === DEFAULT_HEAD) {
      return getCurrentBranch({ gitRepoPath });
    }

    const { exitCode } =
      await $`git show-ref --verify --quiet refs/heads/${branchInput}`
        .cwd(gitRepoPath)
        .nothrow();

    if (exitCode !== 0) {
      const errorMessage = `Input branch ${branchInput} does not exist.`;
      console.error(errorMessage);
      return err(new Error(errorMessage));
    }

    return ok(branchInput as GitBranch);
  } catch (error) {
    const errorMessage = `Failed to validate branch input: ${branchInput}.`;
    console.error(errorMessage);
    return err(new Error(errorMessage));
  }
}

async function getCurrentBranch({
  gitRepoPath,
}: {
  gitRepoPath: GitRepoPath;
}): Promise<Result<GitBranch, Error>> {
  try {
    const result = await $`git branch --show-current`.cwd(gitRepoPath).text();

    const currentBranch = result.trim() as GitBranch;

    return ok(currentBranch);
  } catch (error) {
    const errorMessage = `Failed to get current branch.`;
    console.error(errorMessage);
    return err(new Error(errorMessage));
  }
}

export { validateBranchInput, getCurrentBranch };
