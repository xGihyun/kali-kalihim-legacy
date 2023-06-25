import type { PageServerLoad } from './$types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const section = params.section;
	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', section));
	const usersDocs = await getDocs(q);
	let users = usersDocs.docs
		.map((user) => user.data() as UserData)
		.sort((a, b) => b.score - a.score);

	setHeaders({ 'cache-control': 'max-age=30, stale-while-revalidate=600' });
	
	return {
		users: users,
		section
	};
};
