import { Hono } from "hono";
import { MANAGER_SERVICE_DEV_PORT } from "@es-vanguard/utils/constants/ports";

const app = new Hono();
app.get("/", (c) => c.text("Hi, I'm the Manager service!"));

app.post("/watch-report", (c) => c.text("Watch report endpoint hit!"));

export default {
  port: process.env.PORT ? Number(process.env.PORT) : MANAGER_SERVICE_DEV_PORT,
  fetch: app.fetch,
};
