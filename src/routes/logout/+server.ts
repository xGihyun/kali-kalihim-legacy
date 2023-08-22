import { defaultUserData } from '$lib/default';
import { auth } from '$lib/firebase/firebase';
import { currentUser } from '$lib/store';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { signOut } from 'firebase/auth';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	console.log('Resetting writable...');

	currentUser.set({
		...defaultUserData
	});

	locals.userData = {
		...defaultUserData
	};

	await signOut(auth);

	console.log('Deleting cookies...');

	cookies.delete('session');

	throw redirect(302, '/');
};
