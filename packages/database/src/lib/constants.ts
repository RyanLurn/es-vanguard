import { dbEnvVars } from "@/lib/env-vars";

const LOCAL_DB_FILE_PATH = Bun.resolveSync(
  `../../${dbEnvVars.LOCAL_DB_FILE_NAME}`,
  import.meta.dir
);

const DB_URL = `file:${LOCAL_DB_FILE_PATH}`;

export { LOCAL_DB_FILE_PATH, DB_URL };
