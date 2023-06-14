// import { browser } from '$app/environment';
// import { db } from '$lib/firebase/firebase';
// import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.userData) {
		return;
	}

	// console.log('\nlayout.server')
	// console.log(locals.userData)
	return {
		user: locals.userData
	};
};
