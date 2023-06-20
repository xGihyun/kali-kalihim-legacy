import { collection, getDocs, query, where } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { PendingMatch } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const section = params.section;

	const pendingMatchCollection = collection(db, 'pending_matches');
	const q = query(pendingMatchCollection, where('section', '==', section));
	const pendingMatchesDocs = await getDocs(q);
	const pendingMatches = pendingMatchesDocs.docs.map((match) => match.data() as PendingMatch);

	return {
		section,
		matches: pendingMatches
	};
};
