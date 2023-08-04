import type { LayoutServerLoad } from './$types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { MatchSet } from '$lib/types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params }) => {
	const section = params.section;
	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const matchSetsDocs = await getDocs(matchQuery);

	if (matchSetsDocs.empty) {
		throw error(404, 'No matches available.');
	}

	const matchSets = matchSetsDocs.docs
		.map((matchSet) => {
			const matchSetId = matchSet.id;
			const matchSetData = matchSet.data() as MatchSet;

			return {
				id: matchSetId,
				data: matchSetData
			};
		})
		.sort((a, b) => a.data.set - b.data.set);

	return {
		section,
		matchSets
	};
};
