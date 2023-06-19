// import { browser } from '$app/environment';
// import { db } from '$lib/firebase/firebase';
// import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { collection, getDocs } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { PendingMatches } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.userData || !locals.userData.auth_data.uid) {
		return;
	}

	const pendingMatchesCollection = collection(
		db,
		`users/${locals.userData.auth_data.uid}/pending_matches`
	);
	const getPendingMatchesDocs = await getDocs(pendingMatchesCollection);
	const pendingMatches: PendingMatches[] = getPendingMatchesDocs.docs.map(
		(match) => JSON.parse(JSON.stringify(match.data())) as PendingMatches
	);

	// console.log('\nlayout.server')
	// console.log(locals.userData)
	return {
		user: locals.userData,
		notifications: pendingMatches
	};
};
