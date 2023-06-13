/** @type {import('@sveltejs/kit').Handle} */

import { auth, db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// https://kit.svelte.dev/docs/hooks
export async function handle({ event, resolve }) {
	const session = event.cookies.get('session');

	// Redirects to login page if an unknown user tries to access other pages
	if (event.url.pathname !== '/' && !session) {
		console.log('Access Denied');
		throw redirect(307, '/');
	}

	// If there is no user, do nothing
	if (!session) return await resolve(event);

	// Fetch data from firestore and set the locals
	const userRef = doc(db, 'users', session);
	const docSnap = await getDoc(userRef);

	if (docSnap.exists()) {
		const data = docSnap.data() as UserData;
		event.locals.userData = data;

		console.log('Hooks run docSnap');
		console.log(event.locals.userData);
	}

	// onAuthStateChanged(auth, (user) => {
	// 	if (user) {
	// 		console.log('User has logged in!');
	// 	} else {
	// 		console.log('User has logged out!');
	// 	}
	// });

	// if (
	// 	event.url.pathname === '/register' &&
	// 	event.locals.userData.auth_data.is_logged_in &&
	// 	event.locals.userData.auth_data.is_registered
	// ) {
	// 	console.log(`User ${event.locals.userData.auth_data.email} is logged in.`);
	// 	throw redirect(302, '/');
	// }

	return await resolve(event);
}
