import soap from '../utils/soap.js';
import { XmlNodes, XmlString, XmlInteger } from '../utils/xml.js';

export default async function members(club, season) {
	let xml = await soap({ GetMembersRequest: { Club: club, Season: season, WithResults: true } });
	return XmlNodes(xml, 'MemberEntries', parseMember);
}

function interpretResults(results) {
	let matchesWon = 0;
	let setsWon = 0;
	for (let i = 0; i < results.length; ++i) {
		if (results[i].result === "V") ++matchesWon;
		setsWon += results[i].setsWon;
	}
	return {
		matchesPlayed: results.length,
		matchesWon: matchesWon,
		setsWon: setsWon,
		setWonInLoses: setsWon - matchesWon * 3
	};
}

function parseMember(xml) {
	let results = XmlNodes(xml, 'ResultEntries', parseResult);

	let member = {
		ranking: XmlString(xml, 'Ranking'),
		lastname: XmlString(xml, 'LastName'),
		firstname: XmlString(xml, 'FirstName'),
		allResults: interpretResults(results),
		tournamentLessResults: interpretResults(results.filter((result) => result.type === 'C'))
	};

	return member;
}

function parseResult(xml) {
	return {
		type: XmlString(xml, 'CompetitionType'),
		setsWon: XmlInteger(xml, 'SetFor'),
		result: XmlString(xml, 'Result')
	};
}