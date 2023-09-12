import soap from '../utils/soap.js';
import { XmlNodes, XmlString } from '../utils/xml.js';

export default async function clubs(season) {
	let xml = await soap({ GetClubs: { Season: season } });
	return XmlNodes(xml, 'ClubEntries', parseClub);
}

function parseClub(xml) {
	return {
		id: XmlString(xml, 'UniqueIndex'),
		longname: XmlString(xml, 'LongName')
	};
}
