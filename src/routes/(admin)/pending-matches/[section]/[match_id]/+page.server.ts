import { db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import type { MatchSet, PendingMatch } from '$lib/types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const matchId = params.match_id;

	const matchSetRef = doc(db, `match_sets/${matchId}`);
	const matchSetDoc = await getDoc(matchSetRef);
	const matchSet = matchSetDoc.data() as MatchSet;

	const matchesCollection = collection(db, `match_sets/${matchId}/matches`);
	const matchesDocs = await getDocs(matchesCollection);
	const matches = matchesDocs.docs.map((match) => match.data() as PendingMatch);

	setHeaders({ 'cache-control': 'max-age=60, stale-while-revalidate=300' });

	return {
		matchId,
		matches,
		matchSet
	};
};
