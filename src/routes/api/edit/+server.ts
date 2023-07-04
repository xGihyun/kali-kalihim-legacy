import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { updateOverallRankings, updateSectionRankings } from '$lib/utils/update';
import type { RequestHandler } from '@sveltejs/kit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const firstName = data.get('first-name')?.toString().trim() || '';
	const lastName = data.get('last-name')?.toString().trim() || '';
	const age = Number(data.get('age')?.toString());
	const email = data.get('email')?.toString().trim() || '';
	const sex = data.get('sex')?.toString() || '';
	const section = data.get('section')?.toString() || '';
	const contactNumber = Number(data.get('contact-number')?.toString().trim());
	const score = Number(data.get('score'));
	const uid = data.get('uid')?.toString();

	if (!uid) {
		console.error('No user');
		return new Response();
	}

	if (isNaN(score) || isNaN(contactNumber)) {
		console.error('Input is not a number.');
		return new Response();
	}

	const userRef = doc(db, 'users', uid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const updatedUserData: UserData = {
		...userData,
		auth_data: {
			...userData.auth_data,
			email
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
		await updateSectionRankings(userData.personal_data.section);
		await updateOverallRankings();
	}

	console.log('Data has been updated.');

	return new Response();
};
