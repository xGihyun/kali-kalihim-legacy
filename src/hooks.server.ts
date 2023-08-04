import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';

// https://kit.svelte.dev/docs/hooks
export async function handle({ event, resolve }) {
	const session = event.cookies.get('session');

	if (event.url.pathname !== '/' && !session) {
		console.log('Access Denied');
		throw redirect(307, '/');
	}

	if (!session) {
		console.log('No user session.');
		return await resolve(event);
	}

	const userRef = doc(db, 'users', session);
	const docSnap = await getDoc(userRef);

	if (!docSnap.exists()) {
		console.log("Document snapshot doesn't exist");
		return await resolve(event);
	}

	console.log('User exists.');

	// I might not need to set the locals as the whole user data, will probably set to the uid only
	const data = docSnap.data() as UserData;
	event.locals.userData = data;

	const isAdminRoute = event.route.id?.startsWith('/(admin)');

	// Make sure only admin users can access admin routes
	if (data.auth_data.role !== 'admin' && isAdminRoute) {
		console.log(`${data.auth_data.email} is not an admin. Access denied.`);
		throw redirect(307, '/');
	}

	return await resolve(event);
}
