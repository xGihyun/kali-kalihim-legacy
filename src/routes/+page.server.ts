import { auth, db } from '$lib/firebase/firebase';
import { redirect, type Actions } from '@sveltejs/kit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { currentUser } from '$lib/store';
import type { UserAuthData, UserData, UserPersonalData } from '$lib/types';
import { setCookie } from '$lib/cookie';
import { defaultPersonalData } from '$lib/default';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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
	},
	login: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString().trim();

		if (!email || !password) {
			console.log('Missing email or password.');
			return;
		}

		console.log('Logging in...');

		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			const user = result.user;

			// The initial user auth data to store.
			const userAuthData: UserAuthData = {
				username: user.displayName,
				uid: user.uid,
				email: user.email,
				photo_url: user.photoURL,
				is_logged_in: true,
				is_registered: false,
				role: 'user'
			};

			// The initial personal data to store. Values will be empty if it is a new user.
			const userPersonalData: UserPersonalData = {
				...defaultPersonalData
			};

			// The initial user data. It will be overwritten if the user already exists.
			let userData: UserData = {
				auth_data: userAuthData,
				personal_data: userPersonalData
			};

			const userRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(userRef);

			if (!docSnap.exists()) {
				// User document doesn't exist, create a new document
				await setDoc(userRef, userData);
			} else {
				// User document exists, update the auth_data field
				await updateDoc(userRef, { 'auth_data.is_logged_in': true });

				// Get the updated user data
				const userDoc = await getDoc(userRef);
				userData = userDoc.data() as UserData;

				console.log(userData);
			}

			cookies.set('session', user.uid, { maxAge: 60 * 60 * 24 * 7 });

			currentUser.update(
				(val) =>
					(val = {
						auth_data: {
							email: userData.auth_data?.email || '',
							is_logged_in: userData.auth_data?.is_logged_in || false,
							is_registered: userData.auth_data?.is_registered || false,
							photo_url: userData.auth_data?.photo_url || '',
							uid: userData.auth_data?.uid || '',
							username: userData.auth_data?.username || '',
							role: userData.auth_data?.role || ''
						},
						personal_data: {
							age: userData.personal_data?.age || -1,
							contact_number: userData.personal_data?.contact_number || -1,
							name: {
								first: userData.personal_data?.name.first || '',
								last: userData.personal_data?.name.last || ''
							},
							section: userData.personal_data?.section || '',
							sex: userData.personal_data?.sex || ''
						}
					})
			);

			// throw redirect(302, '/');
		} catch (error) {
			// Handle Errors here.
			console.error(error);
		}
	}
};
