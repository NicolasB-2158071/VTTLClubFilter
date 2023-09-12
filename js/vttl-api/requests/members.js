import soap from '../utils/soap.js';
import { XmlNodes, XmlString, XmlInteger } from '../utils/xml.js';

export default async function members(club, season) {
	let xml = await soap({ GetMembersRequest: { Club: club, Season: season, WithResults: true } });
	return XmlNodes(xml, 'MemberEntries', parseMember);
}

function parseMember(xml) {
	let matchesWon = 0;
	let setsWon = 0;

	let results = XmlNodes(xml, 'ResultEntries', parseResult);
	for (let i = 0; i < results.length; ++i) {
		if (results[i].result === "V") ++matchesWon;
		setsWon += results[i].setsWon;
	}

	let member = {
		//id: XmlString(xml, 'UniqueIndex'),
		ranking: XmlString(xml, 'Ranking'),
		lastname: XmlString(xml, 'LastName'),
		firstname: XmlString(xml, 'FirstName'),
		matchesPlayed: results.length,
		matchesWon: matchesWon,
		setsWon: setsWon,
		setWonInLoses: setsWon - matchesWon * 3
	};

	return member;
}

function parseResult(xml) {
	return {
		setsWon: XmlInteger(xml, 'SetFor'),
		result: XmlString(xml, 'Result')
	};
}