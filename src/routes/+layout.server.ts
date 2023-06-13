// import { browser } from '$app/environment';
// import { db } from '$lib/firebase/firebase';
// import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.userData) {
		return;
	}

	console.log('\nlayout.server')
	console.log(locals.userData)

	/**
	 * NOTE: WILL BE USED LATER (MAYBE)
	 */
	// Get all of the documents
	// const usersCollection = collection(db, 'users');
	// const usersDocs = await getDocs(usersCollection);

	// /** @type {import('$lib/types').UserData[]} */
	// let docData = [];

	// usersDocs.forEach((doc) => {
	// 	docData.push(/** @type {import('$lib/types').UserData} */ (doc.data()));
	// });
	return {
		user: locals.userData
	};
};
