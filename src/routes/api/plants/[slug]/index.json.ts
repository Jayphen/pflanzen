import type { Request, Response } from "express";
import { base } from "../../_lib/airtable";
import marked from "marked";

export async function get(req: Request, res: Response) {
  const plant = await base(process.env.AIRTABLE_BASE).find(req.params.slug);

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  const { _rawJson } = plant;

  if (_rawJson.fields.Images) {
    _rawJson.fields.Images = _rawJson.fields.Images.reverse();
  }

  if (_rawJson.fields.Notes) {
    _rawJson.fields.Notes = marked(_rawJson.fields.Notes);
  }

  res.end(JSON.stringify(_rawJson));
}
