import { collection, getDocs, query, where } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { MatchSet, MatchSetWithId } from '$lib/types';
import { dataToObject } from '$lib/utils/functions';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.userData || !locals.userData.auth_data || !locals.userData.auth_data.uid) return;

	const { section } = locals.userData.personal_data;

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const getMatchDocs = await getDocs(matchQuery);
	const latestMatchSetWithId: MatchSetWithId = getMatchDocs.docs
		.map((match) => {
			const matchData = match.data() as MatchSet;
			const matchId = match.id;

			return {
				match: matchData,
				id: matchId
			};
		})
		.sort((a, b) => b.match.timestamp.seconds - a.match.timestamp.seconds)[0];

	let serializedMatchSet: MatchSet | undefined;
	let matchSetId: string = '';

	if (latestMatchSetWithId && latestMatchSetWithId.id) {
		matchSetId = latestMatchSetWithId.id;
		const latestMatchSet: MatchSet = latestMatchSetWithId.match;

		serializedMatchSet = dataToObject(latestMatchSet) as MatchSet;
	}

	return {
		user: locals.userData,
		matchSet: serializedMatchSet,
		matchSetId
	};
};
