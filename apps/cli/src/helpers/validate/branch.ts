import { $ } from "bun";
import { err, ok, type Result } from "neverthrow";

async function validateGitBranch({
  cwd,
  branchName,
}: {
  cwd: string;
  branchName: string;
}): Promise<Result<string, Error>> {
  try {
    const { exitCode } =
      await $`git show-ref --verify --quiet refs/heads/${branchName}`
        .cwd(cwd)
        .nothrow();

    if (exitCode !== 0) {
      const errorMessage = `Branch ${branchName} does not exist.`;
      console.error(errorMessage);
      return err(new Error(errorMessage));
    }

    return ok(branchName);
  } catch (error) {
    const errorMessage = `Failed to validate branch ${branchName}.`;
    console.error(errorMessage);
    return err(new Error(errorMessage));
  }
}

export { validateGitBranch };
