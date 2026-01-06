import { Hono } from "hono";
import { MANAGER_SERVICE_DEV_PORT } from "@es-vanguard/utils/constants/ports";
import { validator } from "hono/validator";
import { WatchReportEndpointInputSchema } from "@/lib/schemas";
import { ValidationError } from "@es-vanguard/utils/errors/classes";
import { db } from "@es-vanguard/database/connect";

const app = new Hono();
app.get("/", (c) => c.text("Hi, I'm the Manager service!"));

app.post(
  "/watch-report",
  validator("json", (value, context) => {
    const validationResult = WatchReportEndpointInputSchema.safeParse(value);
    if (!validationResult.success) {
      const validationError = new ValidationError("Invalid watch report data", {
        cause: validationResult.error,
        context: {
          input: value,
        },
      });
      return context.json(
        {
          code: validationError.code,
          message: validationError.message,
          context: {
            input: value,
          },
        },
        422
      );
    }
    return validationResult.data;
  }),
  async (context) => {
    const { packages } = context.req.valid("json");
    // TODO: Insert packages into database
    return context.text("Watch report processed successfully!");
  }
);

export default {
  port: process.env.PORT ? Number(process.env.PORT) : MANAGER_SERVICE_DEV_PORT,
  fetch: app.fetch,
};
