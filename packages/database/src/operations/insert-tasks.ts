import { db } from "@/connect";
import { DatabaseQueryError } from "@/lib/errors";
import type { InsertTaskInputValues } from "@/lib/types";
import { taskTable } from "@/schema/task";
import { UnexpectedError } from "@es-vanguard/utils/errors/classes";
import { DrizzleQueryError } from "drizzle-orm";
import { err, ok, type Result } from "neverthrow";
import { LibsqlError } from "@libsql/client";

type InputTask = Pick<
  InsertTaskInputValues,
  "name" | "version" | "previousVersion" | "invoker"
>;

export async function insertTasks({
  inputTasks,
}: {
  inputTasks: InputTask[];
}): Promise<
  Result<
    {
      acceptedTasks: InputTask[];
      rejectedTasks: InputTask[];
    },
    DatabaseQueryError | UnexpectedError
  >
> {
  const acceptedTasks: InputTask[] = [];
  const rejectedTasks: InputTask[] = [];
  try {
    const insertedTasks = await db
      .insert(taskTable)
      .values(inputTasks)
      .returning()
      .onConflictDoNothing();

    for (const inputTask of inputTasks) {
      const found = insertedTasks.find(
        (insertedTask) =>
          insertedTask.name === inputTask.name &&
          insertedTask.version === inputTask.version &&
          insertedTask.previousVersion === inputTask.previousVersion
      );
      if (found) {
        acceptedTasks.push(inputTask);
      } else {
        rejectedTasks.push(inputTask);
      }
    }

    return ok({
      acceptedTasks,
      rejectedTasks,
    });
  } catch (error) {
    const context = {
      table: taskTable._.name,
      operation: "insert",
      input: inputTasks,
    } as const;

    if (error instanceof DrizzleQueryError) {
      const originalError = error.cause;
      if (originalError instanceof LibsqlError) {
        const databaseQueryError = new DatabaseQueryError(
          "Failed to insert tasks",
          {
            cause: error,
            context: {
              ...context,
              source: "libsql",
            },
          }
        );
        return err(databaseQueryError);
      }

      const databaseQueryError = new DatabaseQueryError(
        "Failed to insert tasks",
        {
          cause: error,
          context: {
            ...context,
            source: "drizzle",
          },
        }
      );
      return err(databaseQueryError);
    }

    const unexpectedError = new UnexpectedError("Failed to insert tasks", {
      cause: error,
      context,
    });
    return err(unexpectedError);
  }
}
