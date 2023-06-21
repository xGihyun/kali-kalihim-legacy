import { db } from '$lib/firebase/firebase';
import type { PendingMatch, UserData } from '$lib/types';
import { error, type RequestHandler } from '@sveltejs/kit';
import { Timestamp, collection, getDocs, query, where } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const section = data.get('section')?.toString() as string;
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
	const pendingMatches: PendingMatch[] = [];

	// Pair shuffled users for a randomized 1v1 match
	for (let i = 0; i < totalUsers; i += 2) {
		const user1 = shuffledUsers[i];
		const user2 = shuffledUsers[i + 1];
		const currentDate = Timestamp.fromDate(new Date());
		const skillToPerform = getRandomArnisSkill().skill;
		const footworkToPerform = getRandomArnisSkill().footwork;

		if (!user2) {
			break;
		}

		pendingMatches.push({
			players: [user1, user2],
			section: section,
			timestamp: currentDate,
			skill: skillToPerform,
			footwork: footworkToPerform
		});
	}

	const response = {
		section,
		pendingMatches
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

function getRandomArnisSkill() {
	const skills = [
		'Strikes',
		'Blocks',
		'Forward Sinawali',
		'Sideward Sinawali',
		'Reversed Sinawali'
	];
	const footworks = ['Guerrero', 'Cabellero', 'Triangle', 'Reversed Triangle'];

	const randomSkillIndex = Math.floor(Math.random() * skills.length);
	const randomFootworkIndex = Math.floor(Math.random() * footworks.length);

	const randomSkill = skills[randomSkillIndex];
	const randomFootwork = footworks[randomFootworkIndex];

	return {
		skill: randomSkill,
		footwork: randomFootwork
	};
}
