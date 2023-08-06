import {
	collection,
	doc,
	getCountFromServer,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { CardBattle, MatchSet, MatchSets, PlayerWithDamage } from '$lib/types';
import type { Actions } from '@sveltejs/kit';
import { battle } from '$lib/utils/battlecards';

export const load: LayoutServerLoad = async ({ params }) => {
	const { section } = params;

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const matchSetsDocs = await getDocs(matchQuery);

	if (matchSetsDocs.empty) {
		return;
	}

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

	return {
		matchSets,
		section
	};
};
