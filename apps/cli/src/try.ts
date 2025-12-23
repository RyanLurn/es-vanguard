import { CwdSchema } from "@/helpers/schemas";
import * as z from "zod";

const InvalidCwd = "Invalid cwd";
const InvalidDir = "D:\\Ryan Luong\\dev\\es-vanguard\\apps\\cli\\src\\try.ts";
const NotGitRepo = "D:\\Ryan Luong\\dev";
const ValidCwd = "D:\\Ryan Luong\\dev\\es-vanguard";

console.log("Parsing invalid cwd:", InvalidCwd);
const invalidCwdParseResult = await CwdSchema.safeParseAsync(InvalidCwd);
if (!invalidCwdParseResult.success) {
  const prettyError = z.prettifyError(invalidCwdParseResult.error);
  console.log("Invalid cwd parse fail result:", prettyError);
}

console.log("Parsing invalid directory:", InvalidDir);
const invalidDirParseResult = await CwdSchema.safeParseAsync(InvalidDir);
if (!invalidDirParseResult.success) {
  const prettyError = z.prettifyError(invalidDirParseResult.error);
  console.log("Invalid directory parse fail result:", prettyError);
}

console.log("Parsing not git repo:", NotGitRepo);
const notGitRepoParseResult = await CwdSchema.safeParseAsync(NotGitRepo);
if (!notGitRepoParseResult.success) {
  const prettyError = z.prettifyError(notGitRepoParseResult.error);
  console.log("Not git repo parse fail result:", prettyError);
}

console.log("Parsing valid cwd:", ValidCwd);
const validCwdParseResult = await CwdSchema.safeParseAsync(ValidCwd);
if (!validCwdParseResult.success) {
  const prettyError = z.prettifyError(validCwdParseResult.error);
  console.log("Valid cwd parse fail result:", prettyError);
}
console.log("Valid cwd parse success result:", validCwdParseResult.data);
