import { validateGitBranch } from "@/helpers/validate/branch";

const testCases = ["main", "cli", "invalid"];

for (const testCase of testCases) {
  const result = await validateGitBranch({
    cwd: "D:\\Ryan Luong\\dev\\es-vanguard",
    branchName: testCase,
  });

  if (result.isOk()) {
    console.log(`${testCase} is valid`);
  }
}
