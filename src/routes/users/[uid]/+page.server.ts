import { doc, getDoc } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const uid = params.uid;

	const userRef = doc(db, 'users', uid);
	const userDoc = await getDoc(userRef);
	const user = userDoc.data() as UserData;

	return {
		user
	};
};
