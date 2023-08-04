import { db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import type { MatchSet, Match, CardBattle } from '$lib/types';
import { CACHE_DURATION } from '$lib/constants';
import { error, type Actions } from '@sveltejs/kit';
import { battle } from '$lib/utils/battlecards';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const matchSetId = params.match_id;

	const matchSetRef = doc(db, `match_sets/${matchSetId}`);
	const matchSetDoc = await getDoc(matchSetRef);

	if (!matchSetDoc.exists) {
		throw new Error("Match set doesn't exist");
	}

	const matchSet = matchSetDoc.data() as MatchSet;

	const matchesCollection = collection(db, `match_sets/${matchSetId}/matches`);
	const matchesDocs = await getDocs(matchesCollection);

	if (matchesDocs.empty) {
		throw error(404, 'No matches found');
	}

	const matches = matchesDocs.docs.map(
		(match) => JSON.parse(JSON.stringify(match.data())) as Match
	);

	const cardBattleCollection = collection(db, `match_sets/${matchSetId}/card_battle`);
	const cardBattleDocs = await getDocs(cardBattleCollection);

	if (cardBattleDocs.empty) {
		throw error(404, 'No card battles found');
	}

	const cardBattle: CardBattle[] = cardBattleDocs.docs.map(
		(match) => JSON.parse(JSON.stringify(match.data())) as CardBattle
	);

	// console.log(cardBattle);
	// setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		matchSetId,
		matches,
		matchSet,
		cardBattle
	};
};

export const actions: Actions = {
	card_battle: async ({ params, request }) => {
		const matchSetId = params.match_id;

		if (!matchSetId) {
			throw error(404, 'Match set not found.');
		}

		const data = await request.formData();
		const cardBattle = data.get('card_battle')?.toString();

		if (!cardBattle) {
			throw new Error('Cards are undefined');
		}

		const parsedCardBattle = JSON.parse(cardBattle) as CardBattle[];

		const cardBattleResults = await runCardBattle(parsedCardBattle, matchSetId);

		return { cardBattleResults };
	}
};

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
