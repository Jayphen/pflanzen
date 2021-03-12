import type { Request, Response } from "express";
import { base } from "../../_lib/airtable";

export async function post(req: Request, res: Response) {
  if (req.session.auth) {
    const create = await base("Diary").create({
      Title: req.body.title,
      Entry: req.body.entry,
      [process.env.AIRTABLE_BASE]: [req.params.slug],
    });

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(create._rawJson));
  } else {
    res.writeHead(401, {
      "Content-Type": "application/json",
    });
    res.end();
  }
}
