import type { Context } from "@/utils/types";

const startTime = Bun.nanoseconds();

const context: Context = {
  service: "analyst" as const,
  runId: Bun.randomUUIDv7(),
  time: {
    start: startTime,
    end: undefined,
    duration: undefined,
  },
  steps: [],
};
