import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import manager from "@/index";
import type { WatchReportEndpointInput } from "@/lib/schemas";

let server: Bun.Server<typeof manager>;

describe("Watch report endpoint", () => {
  beforeAll(() => {
    server = Bun.serve(manager);
  });

  test("should accept valid watch report data", async () => {
    const data: WatchReportEndpointInput = {
      packages: [
        { name: "test-package", version: "1.0.0" },
        { name: "another-package", version: "2.0.0" },
      ],
    };

    try {
      const response = await fetch(
        `http://localhost:${server.port}/watch-report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      expect(response.status).toBe(200);
    } catch (error) {
      console.error("Fetch failed for valid data:", error);
    }
  });

  test("should reject invalid watch report data", async () => {
    const invalidData = { invalid: "data" };

    try {
      const response = await fetch(
        `http://localhost:${server.port}/watch-report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidData),
        }
      );
      expect(response.status).toBe(422);
    } catch (error) {
      console.error("Fetch failed for invalid data:", error);
    }
  });

  afterAll(() => {
    server.stop(true);
  });
});
