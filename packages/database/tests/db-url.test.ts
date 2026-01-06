import { LOCAL_DB_FILE_PATH } from "@/lib/constants";
import { test, expect } from "bun:test";

test("LOCAL_DB_FILE_PATH resolves correctly", () => {
  const localDbFilePath = Bun.resolveSync(
    `../${process.env.LOCAL_DB_FILE_NAME}`,
    import.meta.dir
  );
  expect(LOCAL_DB_FILE_PATH).toBe(localDbFilePath);
});
