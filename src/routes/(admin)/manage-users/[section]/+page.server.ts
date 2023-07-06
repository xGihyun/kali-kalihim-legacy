import { collection, getDocs, query, where } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const section = params.section;

	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', section));
	const getUsersInSectionDocs = await getDocs(q);
	const usersInSection = getUsersInSectionDocs.docs.map((user) => user.data() as UserData);

	setHeaders({ 'cache-control': 'max-age=120, must-revalidate' });

	return {
		section,
		users: usersInSection
	};
};
