import type { Request, Response } from "express";
import { base } from "../../_lib/airtable";

export async function get(req: Request, res: Response) {
  const plant = await base(process.env.AIRTABLE_BASE).find(req.params.slug);

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  if (plant._rawJson.fields.Images) {
    plant._rawJson.fields.Images = plant._rawJson.fields.Images.reverse();
  }

  res.end(JSON.stringify(plant._rawJson));
}
