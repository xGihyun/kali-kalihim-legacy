import type { PageServerLoad } from './$types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const section = params.section;
	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', section));
	const usersDocs = await getDocs(q);
	let users = usersDocs.docs
		.map((user) => user.data() as UserData)
		.sort((a, b) => b.score - a.score);

	return {
		users: users,
		section
	};
};
