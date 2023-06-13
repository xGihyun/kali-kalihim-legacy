import { setCookie } from '$lib/cookie';
import { defaultPersonalData } from '$lib/default';
import { auth, db } from '$lib/firebase/firebase';
import type { UserAuthData, UserData, UserPersonalData } from '$lib/types';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// It will login via a popup window, might not be good for mobile
// export async function googleAuthPopup() {
// 	const provider = new GoogleAuthProvider();
// 	// Add prompt for user to select an account before log in/register
// 	provider.setCustomParameters({
// 		prompt: 'select_account'
// 	});

// 	try {
// 		const result = await signInWithPopup(auth, provider);
// 		const user = result.user;

// 		// The initial user auth data to store.
// 		const userAuthData: UserAuthData = {
// 			username: user.displayName,
// 			uid: user.uid,
// 			email: user.email,
// 			photo_url: user.photoURL,
// 			is_logged_in: true,
// 			is_registered: false,
// 			role: 'user'
// 		};

// 		// The initial personal data to store. Values will be empty if it is a new user.
// 		const userPersonalData: UserPersonalData = {
// 			...defaultPersonalData
// 		};

// 		// The initial user data. It will be overwritten if the user already exists.
// 		let userData: UserData = {
// 			auth_data: userAuthData,
// 			personal_data: userPersonalData
// 		};

// 		const userRef = doc(db, 'users', user.uid);
// 		const docSnap = await getDoc(userRef);

// 		if (!docSnap.exists()) {
// 			// User document doesn't exist, create a new document
// 			await setDoc(userRef, userData);
// 		} else {
// 			// User document exists, update the auth_data field
// 			await updateDoc(userRef, { 'auth_data.is_logged_in': true });

// 			// Get the updated user data
// 			const userDoc = await getDoc(userRef);
// 			userData = userDoc.data() as UserData;

// 			console.log(userData);
// 		}

// 		/**
// 		 * NOTE: WILL BE USED LATER
// 		 */
// 		// Get the collection for all the users
// 		// const docCollection = collection(db, 'users');
// 		// const docs = await getDocs(docCollection);

// 		// /**
// 		//  * @type {import("@firebase/firestore").DocumentData[]}
// 		//  */
// 		// let docData = [];

// 		// docs.forEach((doc) => {
// 		// 	docData.push(doc.data());
// 		// });

// 		// allUsers.update((val) => (val = /** @type {import('$lib/types').UserData[]} */ (docData)));

// 		// This will set a session cookie
// 		// setCookie(
// 		// 	'authData',
// 		// 	JSON.stringify({
// 		// 		...userAuthData
// 		// 	}),
// 		// 	7
// 		// );

// 		setCookie('session', user.uid, 7);

// 		return {
// 			userData
// 		};
// 	} catch (error) {
// 		// Handle Errors here.
// 		console.error(error);
// 	}
// }

export async function emailPasswordAuth(email: string, password: string) {
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

		/**
		 * NOTE: WILL BE USED LATER
		 */
		// Get the collection for all the users
		// const docCollection = collection(db, 'users');
		// const docs = await getDocs(docCollection);

		// /**
		//  * @type {import("@firebase/firestore").DocumentData[]}
		//  */
		// let docData = [];

		// docs.forEach((doc) => {
		// 	docData.push(doc.data());
		// });

		// allUsers.update((val) => (val = /** @type {import('$lib/types').UserData[]} */ (docData)));

		// This will set a session cookie
		// setCookie(
		// 	'authData',
		// 	JSON.stringify({
		// 		...userAuthData
		// 	}),
		// 	7
		// );

		setCookie('session', user.uid, 7);

		return {
			userData
		};
	} catch (error) {
		// Handle Errors here.
		console.error(error);
	}
}
