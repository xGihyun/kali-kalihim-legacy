import type { CardBattle, Match, PlayerWithDamage } from '$lib/types';
import {
	collection,
	doc,
	getCountFromServer,
	getDocs,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import { CACHE_DURATION } from '$lib/constants';
import type { Actions } from '@sveltejs/kit';
import { battle } from '$lib/utils/battlecards';
import { dataToObject } from '$lib/utils/functions';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const { match_id } = params;

	const arnisMatches = await getArnisMatches(match_id);
	const cardBattleMatches = await getCardBattleMatches(match_id);

	const serializedArnisMatches = dataToObject(arnisMatches) as Match[];
	const serializedCardBattleMatches = dataToObject(cardBattleMatches) as CardBattle[];

	console.log(serializedArnisMatches);

	// setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		arnisMatches: serializedArnisMatches,
		cardBattleMatches: serializedCardBattleMatches,
		matchSetId: match_id
	};
};

async function getArnisMatches(matchSetId: string): Promise<Match[]> {
	try {
		const matchSetCollection = collection(db, `match_sets/${matchSetId}/matches`);
		const matchesDocs = await getDocs(matchSetCollection);

		const matches: Match[] = matchesDocs.docs.map((match) => match.data() as Match);

		return matches;
	} catch (error) {
		// Handle any potential errors during data fetching
		throw new Error('Failed to fetch matches: ' + error);
	}
}

async function getCardBattleMatches(matchSetId: string): Promise<CardBattle[]> {
	try {
		const cardBattleCollection = collection(db, `match_sets/${matchSetId}/card_battle`);
		const cardBattleDocs = await getDocs(cardBattleCollection);

		const matches: CardBattle[] = cardBattleDocs.docs.map((match) => match.data() as CardBattle);

		return matches;
	} catch (error) {
		// Handle any potential errors during data fetching
		throw new Error('Failed to fetch card battle matches: ' + error);
	}
}

export const actions: Actions = {
	card_battle: async ({ request }) => {
		const data = await request.formData();
		const cardBattle = data.get('card_battle')?.toString();
		const matchSetId = data.get('match_set_id')?.toString();

		if (!matchSetId) {
			throw new Error('Match set not found.');
		}

		if (!cardBattle) {
			throw new Error('Cards are undefined.');
		}

		const parsedCardBattle = JSON.parse(cardBattle) as CardBattle[];
		const cardBattleResults = await runCardBattle(parsedCardBattle, matchSetId);

		return { cardBattleResults };
	}
};

function addToMatchHistory(users: PlayerWithDamage[]) {
	const cardBattleHistoryData: CardBattle = {
		players: [...users]
	};

	users.forEach(async (user) => {
		const matchHistoryCollection = collection(
			db,
			`users/${user.auth_data.uid}/card_battle_history`
		);
		const serverCount = await getCountFromServer(matchHistoryCollection);
		const newMatchEntry = doc(
			db,
			`users/${user.auth_data.uid}/card_battle_history/${serverCount.data().count + 1}`
		);

		await setDoc(newMatchEntry, cardBattleHistoryData);
	});
}

async function updateCardBattleDocument(cardBattle: CardBattle[], matchSetId: string, idx: number) {
	const match = cardBattle[idx];
	const player1 = match.players[0];
	const player2 = match.players[1];

	const result = await battle(player1.auth_data.uid, player2.auth_data.uid);

	console.log('Result in updateCardBattle');
	console.log(result);

	const player1TotalDamage = result[0].totalDamage;
	const player2TotalDamage = result[1].totalDamage;

	const cardBattleRef = doc(db, `match_sets/${matchSetId}/card_battle/${idx + 1}`);

	if (player1TotalDamage !== null) {
		player1.total_damage = player1TotalDamage;
	} else {
		player1.total_damage = null;
	}

	if (player2TotalDamage !== null) {
		player2.total_damage = player2TotalDamage;
	} else {
		player2.total_damage = null;
	}

	console.log('Updating doc');
	await updateDoc(cardBattleRef, { players: [player1, player2] });

	addToMatchHistory(match.players);
}

async function runCardBattle(cardBattle: CardBattle[], matchSetId: string): Promise<CardBattle[]> {
	for (let idx = 0; idx < cardBattle.length; idx++) {
		await updateCardBattleDocument(cardBattle, matchSetId, idx);

		console.log('Refreshing cardBattle data...');
	}
	const cardBattleCollection = collection(db, `match_sets/${matchSetId}/card_battle`);
	const snapshot = await getDocs(cardBattleCollection);

	if (snapshot.empty) {
		throw new Error('Card battle collection is empty.');
	}

	cardBattle = snapshot.docs.map((doc) => doc.data() as CardBattle);

	return cardBattle;
}
