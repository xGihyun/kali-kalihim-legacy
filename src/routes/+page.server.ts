import { auth, db } from '$lib/firebase/firebase';
import { redirect } from '@sveltejs/kit';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import { currentUser } from '$lib/store';
import { defaultPersonalData } from '$lib/default';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	fetchSignInMethodsForEmail
} from 'firebase/auth';
import type { UserData, UserPersonalData } from '$lib/types.js';

export const actions = {
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

		currentUser.update((val) => ({
			auth_data: {
				...val.auth_data,
				is_registered: true
			},
			personal_data: {
				...val.personal_data,
				...newPersonalData
			},
			score: val.score,
			rank: val.rank
		}));

		const userRef = doc(db, 'users', userUid);

		await setDoc(
			userRef,
			{
				auth_data: {
					is_registered: true
				},
				personal_data: newPersonalData
			},
			{ merge: true }
		);

		console.log('Now registered!');

		throw redirect(302, '/');
	},
	login: async ({ request, cookies, locals }) => {
		console.log('Logging in!');

		const data = await request.formData();
		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString().trim();

		if (!email || !password) {
			console.log('Missing email or password.');
			return;
		}

		const usersCollection = collection(db, 'users');
		const q = query(usersCollection, orderBy('score', 'desc'));
		const usersDocs = await getDocs(q);

		const signInMethodsForEmail = await fetchSignInMethodsForEmail(auth, email);
		const isEmailAvailable = signInMethodsForEmail.length !== 0;

		if (!isEmailAvailable) {
			const result = await createUserWithEmailAndPassword(auth, email, password);
			const user = result.user;

			const userRef = doc(db, 'users', user.uid);

			const newUserData: UserData = {
				auth_data: {
					email: user.email,
					is_logged_in: true,
					is_registered: false,
					photo_url: user.photoURL,
					role: 'user',
					uid: user.uid,
					username: user.displayName
				},
				personal_data: {
					...defaultPersonalData
				},
				score: 0,
				rank: usersDocs.size
			};

			await setDoc(userRef, newUserData);

			const userDoc = await getDoc(userRef);
			const userData = userDoc.data() as UserData;

			locals.userData = userData;

			console.log('\nRegistered:');

			currentUser.update(
				(val) =>
					(val = {
						auth_data: {
							...userData.auth_data
						},
						personal_data: {
							...userData.personal_data
						},
						score: val.score,
						rank: val.rank
					})
			);

			cookies.set('session', user.uid, { maxAge: 60 * 60 * 24 * 7 });
		} else {
			const result = await signInWithEmailAndPassword(auth, email, password);
			const user = result.user;

			const userRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(userRef);

			// Theoretically, there should already be a document
			if (!docSnap.exists()) {
				// throw error(404, 'User has no document.');
				const newUserData: UserData = {
					auth_data: {
						email: user.email,
						is_logged_in: true,
						is_registered: false,
						photo_url: user.photoURL,
						role: 'user',
						uid: user.uid,
						username: user.displayName
					},
					personal_data: {
						...defaultPersonalData
					},
					score: 0,
					rank: usersDocs.size
				};

				await setDoc(userRef, newUserData);
			} else {
				// User document exists, update the auth_data field
				await updateDoc(userRef, { 'auth_data.is_logged_in': true });
			}

			// Get the updated user data
			const userDoc = await getDoc(userRef);
			const userData = userDoc.data() as UserData;

			locals.userData = userData;

			console.log('\nLogged in:');

			currentUser.update(
				(val) =>
					(val = {
						auth_data: {
							...userData.auth_data
						},
						personal_data: {
							...userData.personal_data
						},
						score: val.score,
						rank: val.rank
					})
			);

			cookies.set('session', user.uid, { maxAge: 60 * 60 * 24 * 7 });
		}

		throw redirect(302, '/');
	}
};
