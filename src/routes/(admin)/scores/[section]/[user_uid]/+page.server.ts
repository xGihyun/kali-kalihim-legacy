import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { error, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const uid = params.user_uid;

	const userRef = doc(db, 'users', uid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;

	setHeaders({ 'cache-control': 'max-age=60, must-revalidate' });

	return {
		user: userData
	};
};

export const actions: Actions = {
	set: async ({ params, request }) => {
		const data = await request.formData();
		const score = Number(data.get('score'));
		const uid = params.user_uid;

		if (!uid) {
			console.log('No user');
			return;
		}

		if (isNaN(score)) {
			console.error('Input is not a number.');
			throw error(403, 'Not a number.');
		}

		const userRef = doc(db, 'users', uid);

		await setDoc(userRef, { score }, { merge: true });

		console.log('Score has been set');
	}
};
