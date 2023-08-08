import type { Actions } from '@sveltejs/kit';
import { db } from '$lib/firebase/firebase';
import type { CardBattle, Match, MatchSet, UserData } from '$lib/types';
import { getRandomArnisSkill } from '$lib/utils/functions';
import { error } from '@sveltejs/kit';
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getCountFromServer,
	getDocs,
	orderBy,
	query,
	setDoc,
	where
} from 'firebase/firestore';

export const actions: Actions = {
	default: async ({ request }) => {
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
		const { finalShuffled, persisted } = await shuffleArray(allUsers, 50);
		const shuffledUsers = finalShuffled;
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
		const getMatchServerCount = await getCountFromServer(matchQuery);
		const matchServerCount = getMatchServerCount.data().count;
		const currentDate = Timestamp.fromDate(new Date());
		const matchSetData: MatchSet = {
			section,
			set: matchServerCount + 1,
			status: 'pending',
			timestamp: currentDate,
			timer_expired: false
		};

		const matchSet = await addDoc(matchesCollection, { ...matchSetData });

		for (let i = 0; i < pendingMatches.length; i++) {
			const users = pendingMatches[i];
			await addPendingMatch(users, section, matchSet.id);
		}

		// pendingMatches.forEach((users) => addPendingMatch(users, section, matchSet.id));

		const responseString = JSON.stringify([...pendingMatches]);

		return { responseString };
	}
};

// Fisher-Yates algorithm
async function shuffleArray(users: UserData[], scoreThreshold: number) {
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
	const sortedUsers = shuffled.sort((a, b) => b.score - a.score);
	const highestScoreIndex = sortedUsers.findIndex((user) => user.score === sortedUsers[0].score);

	if (highestScoreIndex > 0) {
		[sortedUsers[1], sortedUsers[highestScoreIndex]] = [
			sortedUsers[highestScoreIndex],
			sortedUsers[1]
		];
	}

	const finalShuffled: UserData[] = [];

	const scoreGroups: UserData[][] = [];
	let currentGroup: UserData[] = [sortedUsers[0]];

	for (let i = 1; i < sortedUsers.length; i++) {
		const user = sortedUsers[i];
		const prevUser = sortedUsers[i - 1];
		const scoreDifference = Math.abs(user.score - prevUser.score);

		if (scoreDifference <= scoreThreshold) {
			currentGroup.push(user);
		} else {
			scoreGroups.push(currentGroup);
			currentGroup = [user];
		}
	}

	scoreGroups.push(currentGroup);

	for (const group of scoreGroups) {
		for (let i = group.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[group[i], group[j]] = [group[j], group[i]];
		}

		finalShuffled.push(...group);
	}

	return {
		finalShuffled,
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
	const getMatchesCollectionCount = await getCountFromServer(matchesCollection);
	const matchesCollectionCount = getMatchesCollectionCount.data().count;
	const matchDoc = doc(db, `match_sets/${id}/matches/match_${matchesCollectionCount + 1}`);
	// const docRef = await addDoc(matchesCollection, { ...matchData, uids: playerUids });
	await setDoc(matchDoc, { ...matchData, uids: playerUids });

	// Do it this way to make sure they all have the same ID for an easier life
	const defaultMatchesCollection = doc(
		db,
		`match_sets/${id}/default_matches/match_${matchesCollectionCount + 1}`
	);
	await setDoc(defaultMatchesCollection, { ...matchData, uids: playerUids });

	const cardBattleData: CardBattle = {
		players: users.players.map((player) => ({
			...player,
			total_damage: null,
			turns: [],
			battle_cards: []
		}))
	};

	// Add card battle
	const cardBattleCollection = doc(
		db,
		`match_sets/${id}/card_battle/match_${matchesCollectionCount + 1}`
	);

	await setDoc(cardBattleCollection, { ...cardBattleData });

	users.players.forEach(async (user) => {
		const userPendingMatchCollection = collection(
			db,
			`users/${user.auth_data.uid}/pending_matches`
		);
		await addDoc(userPendingMatchCollection, matchData);
	});
}
