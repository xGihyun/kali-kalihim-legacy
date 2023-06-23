import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { PendingMatch } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals, setHeaders }) => {
	if (!locals.userData || !locals.userData.auth_data.uid) {
		return;
	}

	setHeaders({ 'cache-control': 'max-age=30, stale-while-revalidate=600' });

	const pendingMatchesCollection = collection(
		db,
		`users/${locals.userData.auth_data.uid}/pending_matches`
	);
	const q = query(pendingMatchesCollection, orderBy('timestamp.seconds', 'desc'));
	const getPendingMatchesDocs = await getDocs(q);
	const pendingMatches: PendingMatch[] = getPendingMatchesDocs.docs.map(
		(match) => JSON.parse(JSON.stringify(match.data())) as PendingMatch
	);

	return {
		user: locals.userData,
		notifications: pendingMatches
	};
};
