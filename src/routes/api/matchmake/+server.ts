import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { error, type RequestHandler } from '@sveltejs/kit';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const section = data.get('section')?.toString();
	const userCollection = collection(db, 'users');
	const q = query(userCollection, where('personal_data.section', '==', section));
	const allUsersDocs = await getDocs(q);
	const totalUsers = allUsersDocs.size;

	if (totalUsers < 2) {
		console.log('Not enough users');
		throw error(404, 'Not enough users');
	}

	const allUsers = allUsersDocs.docs.map((user) => user.data() as UserData);
	const shuffledUsers = shuffleArray(allUsers);
	const pairedUsers = [];

	// Pair shuffled users for a randomized 1v1 match
	for (let i = 0; i < totalUsers; i += 2) {
		const user1 = shuffledUsers[i];
		const user2 = shuffledUsers[i + 1];
		if (!user2) {
			break;
		}
		pairedUsers.push([user1, user2]);
	}

	const response = {
		section,
		pairedUsers
	};

	const responseString = JSON.stringify(response);

	return new Response(responseString, { headers: { 'Content-Type': 'application/json' } });
};

// Fisher-Yates algorithm
function shuffleArray(users: UserData[]) {
	const shuffled = users.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
