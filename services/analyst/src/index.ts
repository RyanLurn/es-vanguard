import type { StartContext } from "@es-vanguard/telemetry/context";

const startTime = Bun.nanoseconds();

const context: StartContext<"analyst"> = {
  service: "analyst" as const,
  runId: Bun.randomUUIDv7(),
  time: {
    start: startTime,
  },
  steps: [],
};
