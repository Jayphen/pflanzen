import type { Request, Response } from "express";
import { base } from "../../_lib/airtable";
import marked from "marked";

// https://blog.airtable.com/the-right-sort-of-api-updates/
// https://community.airtable.com/t/return-multiple-records-for-linked-table/5954/4

export async function get(req: Request, res: Response) {
  const plant = await base(process.env.AIRTABLE_BASE).find(req.params.slug);

  let diaryEntries = plant.fields.Diary || [];
  let diary = [];

  if (plant.fields.Diary) {
    const query = `OR( RECORD_ID() = '${diaryEntries.join(
      "', RECORD_ID() = '"
    )}' )`;

    diary = await base("Diary").select({ filterByFormula: query }).all();
  }

  const { _rawJson } = plant;

  if (_rawJson.fields.Images) {
    _rawJson.fields.Images = _rawJson.fields.Images.reverse();
  }

  if (_rawJson.fields.Notes) {
    _rawJson.fields.Notes = marked(_rawJson.fields.Notes);
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      plant: _rawJson,
      diary: diary.map((entry) => entry._rawJson),
    })
  );
}
