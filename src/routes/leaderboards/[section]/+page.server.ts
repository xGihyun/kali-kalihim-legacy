import type { PageServerLoad } from './$types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { CACHE_DURATION } from '$lib/constants';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const section = params.section;
	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', section));
	const usersDocs = await getDocs(q);
	let users = usersDocs.docs
		.map((user) => user.data() as UserData)
		.sort((a, b) => b.score - a.score);

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });
	
	return {
		users: users,
		section
	};
};
