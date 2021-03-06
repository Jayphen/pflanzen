import sirv from "sirv";
import express from "express";
import compression from "compression";
import * as sapper from "@sapper/server";
import "dotenv/config";
import cookieSession from "cookie-session";
import type { SapperRequest } from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express()
  .set("trust proxy", true)
  .use(
    cookieSession({
      name: "session",
      secret: process.env.SECRET,
      // Cookie Options
      maxAge: 7 * 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    }),
    express.json(),
    express.urlencoded({ extended: true }),
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware({
      session: (req: SapperRequest & { session?: any }) => ({
        auth: !!req.session?.auth,
      }),
    })
  );

export default app;

if (!process.env.NOW_REGION) {
  app.listen(PORT);
}
