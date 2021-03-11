import type { Request, Response } from "express";
import type { AirtableRecord, PlantField } from "../../../airtable";
import { base } from "../_lib/airtable";

// todo: sorting? filtering?
export interface ResolvedPlants {
  plants: AirtableRecord<PlantField>[];
}

export async function get(_: Request, res: Response) {
  try {
    const pages = await base(process.env.AIRTABLE_BASE).select().all();
    const collator = new Intl.Collator("en", { numeric: true });

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        plants: pages
          .map((page) => page._rawJson)
          .sort(
            (a: AirtableRecord<PlantField>, b: AirtableRecord<PlantField>) => {
              if (!a.fields["Last Watered"]) {
                return -1;
              }
              if (!b.fields["Last Watered"]) {
                return 1;
              }
              return collator.compare(
                a.fields["Last Watered"],
                b.fields["Last Watered"]
              );
            }
          ),
      })
    );
  } catch (e) {
    console.log(e);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: "Airtable is down... https://twitter.com/airtablestatus?",
      })
    );
  }
}
