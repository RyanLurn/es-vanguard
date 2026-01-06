import { describe, test, expect, afterAll, beforeAll } from "bun:test";
import { insertTasks, type InputTask } from "@/operations/insert-tasks";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";
import { db } from "@/connect";
import { taskTable } from "@/schema/task";
import { eq, or } from "drizzle-orm";

describe("insertTasks operation", () => {
  const inputTask1: InputTask = {
    name: "test-package-1" as NpmPackageName,
    version: "1.0.1" as Semver,
    previousVersion: "1.0.0" as Semver,
    invoker: "watcher-service",
  };
  const inputTask2: InputTask = {
    name: "test-package-2" as NpmPackageName,
    version: "2.0.0" as Semver,
    previousVersion: "1.0.0" as Semver,
    invoker: "analysis-job",
  };
  const inputTask3: InputTask = {
    name: "test-package-3" as NpmPackageName,
    version: "3.0.0" as Semver,
    previousVersion: "2.0.0" as Semver,
    invoker: "listener-app",
  };

  async function cleanUpTestData() {
    await db
      .delete(taskTable)
      .where(
        or(
          eq(taskTable.name, inputTask1.name),
          eq(taskTable.name, inputTask2.name),
          eq(taskTable.name, inputTask3.name)
        )
      );
  }

  beforeAll(async () => {
    await cleanUpTestData();
  });

  test("should accept new tasks", async () => {
    const insertTasksResult = await insertTasks({
      inputTasks: [inputTask1, inputTask2],
    });
    expect(insertTasksResult.isOk()).toBe(true);

    if (insertTasksResult.isErr()) {
      console.error(insertTasksResult.error);
    } else {
      const insertedTasks = insertTasksResult.value;
      expect(insertedTasks.rejectedTasks).toHaveLength(0);
      expect(insertedTasks.acceptedTasks).toHaveLength(2);
      expect(insertedTasks.acceptedTasks).toContainEqual(inputTask1);
      expect(insertedTasks.acceptedTasks).toContainEqual(inputTask2);
    }
  });

  test("should accept new task and reject existing task", async () => {
    const insertTasksResult = await insertTasks({
      inputTasks: [inputTask1, inputTask3],
    });
    expect(insertTasksResult.isOk()).toBe(true);

    if (insertTasksResult.isErr()) {
      console.error(insertTasksResult.error);
    } else {
      const insertedTasks = insertTasksResult.value;
      expect(insertedTasks.rejectedTasks).toHaveLength(1);
      expect(insertedTasks.acceptedTasks).toHaveLength(1);
      expect(insertedTasks.rejectedTasks).toContainEqual(inputTask1);
      expect(insertedTasks.acceptedTasks).toContainEqual(inputTask3);
    }
  });

  afterAll(async () => {
    await cleanUpTestData();
  });
});
