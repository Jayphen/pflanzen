import sirv from "sirv";
import express from "express";
import compression from "compression";
import * as sapper from "@sapper/server";
import "dotenv/config";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express().use(
  express.json(),
  express.urlencoded(),
  compression({ threshold: 0 }),
  sirv("static", { dev }),
  sapper.middleware()
);

export default app;

if (!process.env.NOW_REGION) {
  app.listen(PORT);
}
