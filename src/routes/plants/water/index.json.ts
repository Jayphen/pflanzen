import type { Request, Response } from "express";
import { base } from "../../_lib/airtable";
import { format } from "date-fns";

export async function patch(req: Request, res: Response) {
  const update = await base("Table 1").update(req.body.id, {
    "Last Watered": format(new Date(), "yyyy-MM-dd"),
  });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  // console.log(pages)

  res.end(JSON.stringify(update._rawJson));
}
