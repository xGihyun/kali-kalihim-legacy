import { db } from '$lib/firebase/firebase';
import { redirect, type Actions } from '@sveltejs/kit';
import { doc, setDoc } from 'firebase/firestore';
import { currentUser } from '$lib/store';
import type { UserPersonalData } from '$lib/types';

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const userUid = locals.userData.auth_data.uid;

		if (!userUid) {
			return;
		}

		const data = await request.formData();
		const firstName = data.get('first-name')?.toString().trim();
		const lastName = data.get('last-name')?.toString().trim();
		const age = Number(data.get('age')?.toString());
		const sex = data.get('sex')?.toString();
		const section = data.get('section')?.toString();
		const contactNumber = Number(data.get('contact-number')?.toString().trim());

		const newPersonalData: UserPersonalData = {
			age: age,
			contact_number: contactNumber,
			name: {
				first: firstName || '',
				last: lastName || ''
			},
			section: section || '',
			sex: sex || ''
		};

		currentUser.update((val) => {
			return {
				auth_data: {
					...val.auth_data,
					is_registered: true
				},
				personal_data: {
					...val.personal_data
				}
			};
		});

		const userRef = doc(db, 'users', userUid);

		await setDoc(
			userRef,
			{
				auth_data: {
					is_registered: true
				},
				personal_data: {
					...newPersonalData
				}
			},
			{ merge: true }
		);

		console.log('Now registered!');

		// cookies.set('personalData', JSON.stringify({ ...newPersonalData }), {
		// 	maxAge: 604800,
		// 	secure: true,
		// });

		throw redirect(302, '/');
	}
};
