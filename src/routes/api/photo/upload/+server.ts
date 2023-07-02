import { db, storage } from '$lib/firebase/firebase';
import type { RequestHandler } from '@sveltejs/kit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const POST: RequestHandler = async ({ locals, request }) => {
	const userUID = locals.userData.auth_data.uid;

	const data = await request.formData();
	const photo = data.get('file') as File;

	console.log(photo);
	if (!photo) return new Response();

	const fileName = `${userUID}_${photo.name}`;

	// Undefined???
	const storageRef = ref(storage, `profilePictures/${fileName}`);

	try {
		const snapshot = await uploadBytes(storageRef, photo);

		const downloadURL = await getDownloadURL(snapshot.ref);

		await updateProfilePicture(downloadURL, userUID);

		console.log('Profile picture uploaded successfully!');
	} catch (error) {
		console.error('Error uploading profile picture: ', error);
	}

	return new Response();
};

async function updateProfilePicture(downloadURL: string, userUID: string) {
	try {
		const userRef = doc(db, 'users', userUID);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			await updateDoc(userRef, { 'auth_data.photo_url': downloadURL });
		}
	} catch (error) {
		console.error('Error updating profile picture: ', error);
	}
}
