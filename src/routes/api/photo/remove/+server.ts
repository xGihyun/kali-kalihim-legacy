import { db } from '$lib/server/firebase/firebase';
import type { RequestHandler } from '@sveltejs/kit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const POST: RequestHandler = async ({ locals }) => {
	const userUID = locals.userData.auth_data.uid;

	try {
		const userRef = doc(db, 'users', userUID);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			await updateDoc(userRef, { 'auth_data.photo_url': null });
		}
	} catch (error) {
		console.error('Error removing profile picture: ', error);
	}

	return new Response();
};
