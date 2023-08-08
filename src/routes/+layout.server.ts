import { collection, getDocs, query, where } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { MatchSet } from '$lib/types';
import { dataToObject } from '$lib/utils/functions';

interface MatchSetWithId extends MatchSet {
	id: string;
}

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.userData || !locals.userData.auth_data || !locals.userData.auth_data.uid) {
		return;
	}

	const { section } = locals.userData.personal_data;

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const matchSnapshot = await getDocs(matchQuery);

	let latestMatchSet: MatchSetWithId | undefined;
	let serializedMatchSet: MatchSetWithId | undefined;

	if (!matchSnapshot.empty) {
		matchSnapshot.docChanges().forEach((change) => {
			if (change.type === 'added') {
				const matchData = change.doc.data() as MatchSet;
				const matchId = change.doc.id;
				latestMatchSet = {
					...matchData,
					id: matchId
				};
			}
		});
	}

	if (latestMatchSet) {
		serializedMatchSet = dataToObject(latestMatchSet) as MatchSetWithId;
	}

	return {
		user: locals.userData,
		matchSet: serializedMatchSet
	};
};
