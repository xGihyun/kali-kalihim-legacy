import { collection, getDocs, query, where } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { MatchSet } from '$lib/types';
import { dataToObject } from '$lib/utils/functions';

interface MatchSetWithId extends MatchSet {
	id: string;
}

export const load: LayoutServerLoad = async ({ locals }) => {
	const { section } = locals.userData.personal_data;

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const getMatchDocs = await getDocs(matchQuery);
	const latestMatchSet: MatchSetWithId | undefined = getMatchDocs.docs
		.map((match) => {
			const matchData = match.data() as MatchSet;
			const matchId = match.id;

			return {
				...matchData,
				id: matchId
			};
		})
		.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)[0];

	const serializedMatchSet = dataToObject(latestMatchSet) as MatchSetWithId | undefined;

	return {
		user: locals.userData,
		matchSet: serializedMatchSet
	};
};
