import type { Response, NextFunction, Request } from "express";

export async function setCacheHeaders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  next();

  if (res.headersSent) return;

  if (!req.path.includes("json") && !req.session?.auth) {
    res.setHeader(
      "Cache-Control",
      "max-age=60, stale-while-revalidate=120, stale-if-error, public"
    );
  }
}
