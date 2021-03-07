import Airtable from 'airtable'
import type Table from 'airtable/lib/table';

export const base = (name: string): Table => {
	const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('apptEUVJTtM04wn3C');

	return base(name)
}
