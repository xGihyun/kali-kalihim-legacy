import { db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import type { MatchSet, Match } from '$lib/types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const matchSetId = params.match_id;

	const matchSetRef = doc(db, `match_sets/${matchSetId}`);
	const matchSetDoc = await getDoc(matchSetRef);
	const matchSet = matchSetDoc.data() as MatchSet;

	const matchesCollection = collection(db, `match_sets/${matchSetId}/matches`);
	const matchesDocs = await getDocs(matchesCollection);
	const matches = matchesDocs.docs.map(
		(match) => JSON.parse(JSON.stringify(match.data())) as Match
	);

	setHeaders({ 'cache-control': 'max-age=60, must-revalidate' });

	return {
		matchSetId,
		matches,
		matchSet
	};
};
