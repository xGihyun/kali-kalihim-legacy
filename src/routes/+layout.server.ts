import { collection, getDocs } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { PendingMatch } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.userData || !locals.userData.auth_data.uid) {
		return;
	}

	const pendingMatchesCollection = collection(
		db,
		`users/${locals.userData.auth_data.uid}/pending_matches`
	);
	const getPendingMatchesDocs = await getDocs(pendingMatchesCollection);
	const pendingMatches: PendingMatch[] = getPendingMatchesDocs.docs.map(
		(match) => JSON.parse(JSON.stringify(match.data())) as PendingMatch
	);

	return {
		user: locals.userData,
		notifications: pendingMatches
	};
};
