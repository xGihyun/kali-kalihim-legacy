import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { redirect } from '@sveltejs/kit';
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

	console.log('User exists.');

	// Fetch data from firestore and set the locals
	const userRef = doc(db, 'users', session);
	const docSnap = await getDoc(userRef);

	if (docSnap.exists()) {
		const data = docSnap.data() as UserData;
		event.locals.userData = data;
	}

	return await resolve(event);
}
