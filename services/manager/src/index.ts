import { Hono } from "hono";
import { MANAGER_SERVICE_DEV_PORT } from "@es-vanguard/utils/constants/ports";

const app = new Hono();
app.get("/", (c) => c.text("Hello Bun!"));

export default {
  port: process.env.PORT ? Number(process.env.PORT) : MANAGER_SERVICE_DEV_PORT,
  fetch: app.fetch,
};
