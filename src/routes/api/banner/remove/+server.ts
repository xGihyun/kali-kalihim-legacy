import { db } from '$lib/firebase/firebase';
import type { RequestHandler } from '@sveltejs/kit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const POST: RequestHandler = async ({ locals }) => {
	const userUID = locals.userData.auth_data.uid;

	try {
		const userRef = doc(db, 'users', userUID);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			await setDoc(userRef, { auth_data: { banner_url: null } }, { merge: true });
		}
	} catch (error) {
		console.error('Error removing profile picture: ', error);
	}

	return new Response();
};
