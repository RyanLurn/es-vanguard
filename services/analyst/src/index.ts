import type { StartContext } from "@/contexts";

const startTime = Bun.nanoseconds();

const context: StartContext = {
  service: "analyst" as const,
  runId: Bun.randomUUIDv7(),
  time: {
    start: startTime,
  },
  steps: [],
};
