import Airtable from 'airtable';
import { airtable } from './config.yaml';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: process.env.AIRTABLE_API_KEY,
});

export default Airtable.base(airtable.base);
