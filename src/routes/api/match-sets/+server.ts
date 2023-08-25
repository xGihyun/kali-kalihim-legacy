import { db } from '$lib/firebase/firebase';
import type { MatchSet, MatchSets } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const { selectedSection: section } = await request.json();

	console.log('Getting match sets');

	if (!section) {
		throw new Error('No section on POST request.');
	}

	const matchSets = await getMatchSets(section);

	return json(matchSets);
};

async function getMatchSets(section: string) {
	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const matchSetsDocs = await getDocs(matchQuery);

	const matchSets: MatchSets[] = matchSetsDocs.docs
		.map((matchSet) => {
			const matchSetId = matchSet.id;
			const matchSetData = matchSet.data() as MatchSet;

			return {
				id: matchSetId,
				data: matchSetData
			};
		})
		.sort((a, b) => a.data.set - b.data.set);

	return matchSets;
}
