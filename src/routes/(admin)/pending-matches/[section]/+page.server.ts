import type { PageServerLoad } from './$types';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { CardBattle, MatchSet, MatchSets } from '$lib/types';
import { battle } from '$lib/utils/battlecards';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const section = params.section;
	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const matchSetsDocs = await getDocs(matchQuery);

	if (matchSetsDocs.empty) {
		console.log('No matches for: ' + section);
		return {
			section,
			matchSets: undefined
		};
	}

	const matchSets: MatchSets[] = matchSetsDocs.docs
		.map((matchSet) => {
			const matchSetId = matchSet.id;
			const matchSetData = matchSet.data() as MatchSet;

			return {
				id: matchSetId,
				data: matchSetData
			};
		})
		.sort((a, b) => a.data.set - b.data.set);

	return {
		section,
		matchSets
	};
};

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
