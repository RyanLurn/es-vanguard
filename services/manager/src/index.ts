import { Hono } from "hono";
import { MANAGER_SERVICE_DEV_PORT } from "@es-vanguard/utils/constants/ports";
import { validator } from "hono/validator";
import { WatchReportEndpointInputSchema } from "./lib/schemas";

const app = new Hono();
app.get("/", (c) => c.text("Hi, I'm the Manager service!"));

app.post(
  "/watch-report",
  validator("json", (value, context) => {
    const validationResult = WatchReportEndpointInputSchema.safeParse(value);
    if (!validationResult.success) {
      return context.text("Invalid input.", 422);
    }
    return validationResult.data;
  }),
  (c) => c.text("Watch report processed successfully!")
);

export default {
  port: process.env.PORT ? Number(process.env.PORT) : MANAGER_SERVICE_DEV_PORT,
  fetch: app.fetch,
};
