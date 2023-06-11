import { auth, db } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { redirect, type Actions } from '@sveltejs/kit';
import { doc, setDoc } from 'firebase/firestore';
import { currentUser } from '$lib/store';
import { defaultUserData } from '$lib/default';
import type { UserPersonalData } from '$lib/types';

export const actions: Actions = {
	logout: async ({ cookies, locals }) => {
		if (!locals.userData.auth_data.uid) {
			return;
		}

		console.log('Resetting writable...');
		currentUser.set({
			...defaultUserData
		});

		console.log('Logging out, deleting cookies now, and redirecting to homepage...');
		cookies.delete('session');

		const userRef = doc(db, 'users', locals.userData.auth_data.uid);

		// Set login to false in the database
		await setDoc(userRef, { auth_data: { is_logged_in: false } }, { merge: true });

		locals.userData = {
			...defaultUserData
		};

		// Log out user from Google
		await signOut(auth);
		console.log("The user has been logged out, now redirecting to '/'");

		throw redirect(302, '/');
	},
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
