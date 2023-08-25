import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { CACHE_DURATION } from '$lib/constants';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, orderBy('score', 'desc'));
	const usersDocs = await getDocs(q);
	const users = usersDocs.docs.map((user) => user.data() as UserData);

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		users
	};
};
