import type { PageServerLoad } from './$types';
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { updateRank } from '$lib/utils/update';
import { onDestroy } from 'svelte';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	// setHeaders({ 'cache-control': 'max-age=30, stale-while-revalidate=1800' });

	const section = params.section;
	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', section));
	const usersDocs = await getDocs(q);
	let users = usersDocs.docs
		.map((user) => user.data() as UserData)
		.sort((a, b) => b.score - a.score);

	// const unsubRank = onSnapshot(q, async (snapshot) => {
	// 	// Get the snapshots, and sort it before updating the rankings
	// 	const usersSnapshot = snapshot.docs
	// 		.map((user) => user.data() as UserData)
	// 		.sort((a, b) => b.score - a.score);

	// 	// Update the rankings when it changes
	// 	const updatedUsers = await Promise.all(
	// 		usersSnapshot.map(async (user, index) => {
	// 			const userRef = doc(db, 'users', user.auth_data.uid || '');

	// 			await updateDoc(userRef, { 'rank.number': index + 1 });
	// 			await updateRank(userRef);

	// 			return user;
	// 		})
	// 	);

	// 	users = updatedUsers;

	// 	console.log('Section leaderboards snapshot ran. (server)');
	// });

	// onDestroy(() => unsubRank());

	return {
		users: users,
		section
	};
};
