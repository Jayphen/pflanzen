import type { Request, Response } from "express";
import { base } from "../../_lib/airtable";
import { format } from "date-fns";

export async function patch(req: Request, res: Response) {
  if (req.session.auth) {
    const update = await base(process.env.AIRTABLE_BASE).update(req.body.id, {
      "Last Watered": format(new Date(), "yyyy-MM-dd"),
    });

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(update._rawJson));
  } else {
    res.writeHead(401, {
      "Content-Type": "application/json",
    });
    res.end();
  }
}
