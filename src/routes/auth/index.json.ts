import type { Request, Response } from "express";

export async function post(req: Request, res: Response) {
  const authorised = req.body.secret === process.env.SECRET;

  if (authorised) {
    req.session.auth = true;
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ success: true }));
  } else {
    req.session.auth = false;
    res.writeHead(401, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ success: false }));
  }
}
