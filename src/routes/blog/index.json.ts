import {base} from "../_lib/airtable";

export async function get(_, res) {
	const pages = await base('Table 1').select().all();

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify(pages.map(page => page.fields)));
}
