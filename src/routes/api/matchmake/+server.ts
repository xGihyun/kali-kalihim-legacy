import { db } from '$lib/firebase/firebase';
import type { Match, UserData } from '$lib/types';
import { getRandomArnisSkill } from '$lib/utils/functions';
import { error, type RequestHandler } from '@sveltejs/kit';
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getDocs,
	orderBy,
	query,
	setDoc,
	where
} from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const section = data.get('section')?.toString() as string;
	const userCollection = collection(db, 'users');
	const userQuery = query(userCollection, where('personal_data.section', '==', section));
	const allUsersDocs = await getDocs(userQuery);
	const totalUsers = allUsersDocs.size;

	if (totalUsers < 2) {
		console.log('Not enough users');
		throw error(404, 'Not enough users');
	}

	const allUsers = allUsersDocs.docs.map((user) => user.data() as UserData);
	const { shuffled, persisted } = await shuffleArray(allUsers);
	const shuffledUsers = shuffled;
	const persistedUsers = persisted;
	const pendingMatches: Match[] = [];

	// Pair shuffled users for a randomized 1v1 match
	for (let i = 0; i < totalUsers; i += 2) {
		const users = [shuffledUsers[i], shuffledUsers[i + 1]];

		const currentDate = Timestamp.fromDate(new Date());
		const skillToPerform = getRandomArnisSkill().skill;
		const footworkToPerform = getRandomArnisSkill().footwork;

		if (!(users[0] && users[1])) break;

		pendingMatches.push({
			players: users,
			section,
			timestamp: currentDate,
			skill: skillToPerform,
			footwork: footworkToPerform,
			status: 'pending'
		});
	}

	if (persistedUsers.length > 0) {
		for (let i = 0; i < persistedUsers.length; i++) {
			const currentDate = Timestamp.fromDate(new Date());
			const skillToPerform = getRandomArnisSkill().skill;
			const footworkToPerform = getRandomArnisSkill().footwork;

			if (!(persistedUsers[i][0] && persistedUsers[i][1])) break;

			pendingMatches.push({
				players: persistedUsers[i],
				section,
				timestamp: currentDate,
				skill: skillToPerform,
				footwork: footworkToPerform,
				status: 'pending'
			});
		}
	}

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const matchDocs = await getDocs(matchQuery);
	const matchSet = await addDoc(matchesCollection, {
		section,
		set: matchDocs.size + 1,
		status: 'pending'
	});

	pendingMatches.forEach(async (users) => await addPendingMatch(users, section, matchSet.id));

	const response = {
		pendingMatches
	};

	const responseString = JSON.stringify(response);

	return new Response(responseString, { headers: { 'Content-Type': 'application/json' } });
};

// Fisher-Yates algorithm
async function shuffleArray(users: UserData[]) {
	const persisted: UserData[][] = [];

	for (const user of users) {
		const persistOpponent = user.power_cards.find(
			(card) => card.key === 'viral-x-rival' && card.activated && !card.used
		);

		if (persistOpponent) {
			const pendingMatchesCollection = collection(
				db,
				`users/${user.auth_data.uid}/pending_matches`
			);
			const pendingMatchesQuery = query(pendingMatchesCollection, orderBy('timestamp', 'desc'));
			const getPendingMatchesDocs = await getDocs(pendingMatchesQuery);
			const latestPendingMatch = getPendingMatchesDocs.docs.shift()?.data() as Match;
			const persistedPlayers = latestPendingMatch.players;

			persisted.push(persistedPlayers);
		}
	}

	let updatedUsers: UserData[] = [...users];

	for (const pairs of persisted) {
		for (const userInPair of pairs) {
			updatedUsers = updatedUsers.filter((user) => user.auth_data.uid !== userInPair.auth_data.uid);
		}
	}

	const shuffled = updatedUsers.slice();

	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		if (shuffled[i] && shuffled[j]) {
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
	}

	return {
		shuffled,
		persisted
	};
}

async function addPendingMatch(users: Match, section: string, id: string) {
	const matchData: Match = {
		players: [...users.players],
		section,
		skill: users.skill,
		footwork: users.footwork,
		timestamp: users.timestamp,
		status: 'pending'
	};
	const playerUids = users.players.map((user) => user.auth_data.uid);

	const matchesCollection = collection(db, `match_sets/${id}/matches`);
	const docRef = await addDoc(matchesCollection, { ...matchData, uids: playerUids });

	// Do it this way to make sure they all have the same ID for an easier life
	const defaultMatchesCollection = doc(db, `match_sets/${id}/default_matches/${docRef.id}`);
	await setDoc(defaultMatchesCollection, { ...matchData, uids: playerUids });

	users.players.forEach(async (user) => {
		const userPendingMatchCollection = collection(
			db,
			`users/${user.auth_data.uid}/pending_matches`
		);
		await addDoc(userPendingMatchCollection, matchData);
	});
}
