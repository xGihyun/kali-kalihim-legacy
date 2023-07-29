import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { CACHE_DURATION } from '$lib/constants';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const section = params.section;

	console.log(section)

	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', section));
	const getUsersInSectionDocs = await getDocs(q);
	const usersInSection = getUsersInSectionDocs.docs.map((user) => user.data() as UserData);

	const maleUsers = usersInSection
		.filter((user) => user.personal_data.sex === 'male')
		.sort((a, b) => {
			const nameA = `${a.personal_data.name.first} ${a.personal_data.name.last}`;
			const nameB = `${b.personal_data.name.first} ${b.personal_data.name.last}`;

			return nameA.localeCompare(nameB);
		});

	const femaleUsers = usersInSection
		.filter((user) => user.personal_data.sex === 'female')
		.sort((a, b) => {
			const nameA = `${a.personal_data.name.first} ${a.personal_data.name.last}`;
			const nameB = `${b.personal_data.name.first} ${b.personal_data.name.last}`;

			return nameA.localeCompare(nameB);
		});

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		section,
		users: {
			male: maleUsers,
			female: femaleUsers
		}
	};
};
