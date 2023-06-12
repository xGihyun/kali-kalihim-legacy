import { defaultUserData } from '$lib/default';
import { auth, db } from '$lib/firebase/firebase';
import { currentUser } from '$lib/store';
import { redirect, type Actions } from '@sveltejs/kit';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
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
	}
};
