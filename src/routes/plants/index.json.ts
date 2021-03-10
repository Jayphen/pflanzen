import { base } from "../_lib/airtable";

export async function get(_, res) {
  const pages = await base(process.env.AIRTABLE_BASE).select().all();

  const collator = new Intl.Collator("en", { numeric: true });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify(
      pages
        .map((page) => page._rawJson)
        .sort((a, b) =>
          collator.compare(a.fields["Last Watered"], b.fields["Last Watered"])
        )
    )
  );
}
