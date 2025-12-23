import type { Inputs } from "@/helpers/parse-inputs";
import type { GitRepoPath } from "@/helpers/validate/cwd";
import { DEFAULT_BASE, DEFAULT_BRANCHES, DEFAULT_HEAD } from "@/lib/constants";
import { $ } from "bun";
import { err, ok, type Result } from "neverthrow";
import * as z from "zod";

const GitBranchSchema = z.string().brand<"GitBranch">();

type GitBranch = z.infer<typeof GitBranchSchema>;

async function checkBranchExists({
  gitRepoPath,
  branchInput,
}: {
  gitRepoPath: GitRepoPath;
  branchInput: string;
}): Promise<Result<GitBranch, Error>> {
  try {
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

async function validateBranchInputs({
  gitRepoPath,
  base: baseInput,
  head: headInput,
}: { gitRepoPath: GitRepoPath } & Pick<Inputs, "base" | "head">): Promise<
  Result<{ base: GitBranch; head: GitBranch }, Error>
> {
  let checkBaseResult: Result<GitBranch, Error>;
  let checkHeadResult: Result<GitBranch, Error>;

  if (baseInput === DEFAULT_BASE) {
    for (const branch of DEFAULT_BRANCHES) {
      const result = await checkBranchExists({
        gitRepoPath,
        branchInput: branch,
      });
      if (result.isOk()) {
        checkBaseResult = result;
        break;
      }
    }

    const errorMessage =
      "Could not auto-detect the repo's default branch. Please manually specify the base branch.";
    console.error(errorMessage);
    checkBaseResult = err(new Error(errorMessage));
  } else {
    checkBaseResult = await checkBranchExists({
      gitRepoPath,
      branchInput: baseInput,
    });
  }

  if (headInput === DEFAULT_HEAD) {
    checkHeadResult = await getCurrentBranch({ gitRepoPath });
  } else {
    checkHeadResult = await checkBranchExists({
      gitRepoPath,
      branchInput: headInput,
    });
  }

  if (checkBaseResult.isErr() || checkHeadResult.isErr()) {
    return err(new Error("Failed to validate branch inputs."));
  }

  const base = checkBaseResult.value;
  const head = checkHeadResult.value;

  if (base === head) {
    const errorMessage = "Base and head branches cannot be the same.";
    console.error(errorMessage);
    return err(new Error(errorMessage));
  }

  return ok({ base, head });
}

export { checkBranchExists, getCurrentBranch, validateBranchInputs };
