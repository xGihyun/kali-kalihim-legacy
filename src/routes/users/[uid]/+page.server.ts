import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { Section, UserData } from '$lib/types';
import type { Actions } from '@sveltejs/kit';
import { updateOverallRankings, updateRankTitle, updateSectionRankings } from '$lib/utils/update';
import { CACHE_DURATION } from '$lib/constants';

export const load: PageServerLoad = async ({ params, setHeaders, fetch }) => {
	const uid = params.uid;

	const fetchUser = async () => {
		const userRef = doc(db, 'users', uid);
		const userDoc = await getDoc(userRef);
		const user = userDoc.data() as UserData;

		return user;
	};

	const fetchSections = async () => {
		const response = await fetch('/api/section', { method: 'GET' });
		const result = await response.json();

		const sections = result as Section[];

		return sections;
	};

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		user: fetchUser(),
		sections: fetchSections()
	};
};

export const actions: Actions = {
	edit: async ({ params, request }) => {
		const userUID = params.uid;

		if (!userUID) {
			console.error("User doesn't exist.");
			return;
		}

		const data = await request.formData();
		const firstName = data.get('first-name')?.toString().trim() || '';
		const lastName = data.get('last-name')?.toString().trim() || '';
		const age = Number(data.get('age')?.toString().trim());
		const email = data.get('email')?.toString().trim() || '';
		const sex = data.get('sex')?.toString() || '';
		const section = data.get('section')?.toString() || '';
		const contactNumber = Number(data.get('contact-number')?.toString().trim());
		const score = Number(data.get('score')?.toString().trim());
		const role = data.get('role') as string;

		if (isNaN(score) || isNaN(contactNumber)) {
			console.error('Input is not a number.');
			return;
		}

		const userRef = doc(db, 'users', userUID);
		const userDoc = await getDoc(userRef);
		const userData = userDoc.data() as UserData;
		const updatedUserData: UserData = {
			...userData,
			auth_data: {
				...userData.auth_data,
				email,
				role
			},
			personal_data: {
				...userData.personal_data,
				age,
				contact_number: contactNumber,
				name: {
					first: firstName,
					last: lastName
				},
				section,
				sex
			},
			score
		};

		await updateDoc(userRef, { ...updatedUserData });

		if (score !== userData.score) {
			await updateRankTitle(userRef);
			await updateSectionRankings(userData.personal_data.section);
			await updateOverallRankings();
		}

		console.log('Data has been updated.');
	},
	delete: async ({ params }) => {
		const userUID = params.uid;

		if (!userUID) return;

		console.log('Deleting user...');

		const userRef = doc(db, 'users', userUID);

		await deleteDoc(userRef);

		console.log('User has been deleted.');
	}
};
