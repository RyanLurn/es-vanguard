import { CustomError } from "@es-vanguard/utils/errors/classes";
import type { DrizzleQueryError } from "drizzle-orm";

export class DatabaseQueryError extends CustomError {
  constructor(
    message: string,
    options: {
      cause: DrizzleQueryError;
      context: {
        table: string;
        operation: "select" | "insert" | "update" | "delete" | "drizzle-query";
        input: unknown;
      };
    }
  ) {
    super({
      code: "DATABASE_QUERY_ERROR",
      message: message,
      cause: options.cause,
      context: options.context,
    });
  }
}
