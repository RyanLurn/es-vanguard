import { sql } from "drizzle-orm";

/**
 * Get current JavaScript Date in SQLite timestamp format (milliseconds since epoch)
 */
export const jsDateInSqlite = sql`(unixepoch('now', 'subsec') * 1000)`;
