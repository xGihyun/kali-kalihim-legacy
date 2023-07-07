import type { RequestHandler } from '@sveltejs/kit';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '$lib/firebase/firebase';

export const POST: RequestHandler = async ({ locals, request }) => {
	const userUID = locals.userData.auth_data.uid;

	const data = await request.formData();
	const photoName = data.get('file_name') as string;
	const blob = data.get('blob') as File;
	const photoArrayBuffer = await blob.arrayBuffer();

	const fileName = `${userUID}_${photoName}`;

	const storageRef = ref(storage, `banners/${fileName}`);

	try {
		await uploadBytes(storageRef, photoArrayBuffer);

		const downloadURL = await getDownloadURL(storageRef);

		await updateBanner(downloadURL, userUID);

		console.log('Banner uploaded successfully!');
	} catch (error) {
		console.error('Error uploading banner: ', error);
	}

	return new Response();
};

async function updateBanner(downloadURL: string, userUID: string) {
	const userRef = doc(db, 'users', userUID);

	try {
		// await updateDoc(userRef, {
		// 	'auth_data.banner_url': downloadURL
		// });
		await setDoc(userRef, { auth_data: { banner_url: downloadURL } }, { merge: true });

		console.log('Banner URL updated successfully!');
	} catch (error) {
		console.error('Error updating banner URL: ', error);
	}
}
