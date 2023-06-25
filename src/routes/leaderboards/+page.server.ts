import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { PageServerLoad } from '../$types';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, orderBy('score', 'desc'));
	const usersDocs = await getDocs(q);
	const users = usersDocs.docs.map((user) => user.data() as UserData);

	setHeaders({ 'cache-control': 'max-age=30, stale-while-revalidate=600' });

	return {
		users: users
	};
};
