import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { collection, doc, getDocs, orderBy, query, writeBatch } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import { getRandomBattleCards } from '$lib/utils/functions';
import type { BattleCard, Match, UserData } from '$lib/types';
import { CACHE_DURATION } from '$lib/constants';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	const userUID = locals.userData.auth_data.uid;

	const pendingMatchesCollection = collection(db, `users/${userUID}/pending_matches`);
	const pendingMatchesQuery = query(pendingMatchesCollection, orderBy('timestamp', 'desc'));
	const getPendingMatchesDocs = await getDocs(pendingMatchesQuery);

	if (getPendingMatchesDocs.empty) {
		console.log('No pending matches.');

		return;
	}

	const latestPendingMatch = JSON.parse(
		JSON.stringify(getPendingMatchesDocs.docs.shift()?.data())
	) as Match;

	const latestOpponent = JSON.parse(
		JSON.stringify(
			latestPendingMatch.players.find(
				(player) => player.auth_data.uid !== locals.userData.auth_data.uid
			)
		)
	) as UserData;

	const battleCardsCollection = collection(db, `users/${userUID}/stock_battle_cards`);

	const getBattleCards = await getDocs(battleCardsCollection);

	if (getBattleCards.empty) {
		console.log('No battle cards yet.');
		return;
	}

	const battleCards = getBattleCards.docs
		.filter((card) => !card.id.startsWith('card'))
		.map((card) => card.data() as BattleCard);

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return { battleCards, latestOpponent };
};

export const actions: Actions = {
	get_battle_cards: async ({ locals }) => {
		const userUID = locals.userData.auth_data.uid;
		const battlecards = getRandomBattleCards();
		const batch = writeBatch(db);

		for (let i = 0; i < battlecards.strikes.length; i++) {
			const strike = battlecards.strikes[i];
			const battleCardsRef = doc(db, `users/${userUID}/stock_battle_cards/strike_${i + 1}`);
			batch.set(battleCardsRef, { ...strike });
		}

		for (let i = 0; i < battlecards.blocks.length; i++) {
			const block = battlecards.blocks[i];
			const battleCardsRef = doc(db, `users/${userUID}/stock_battle_cards/block_${i + 1}`);
			batch.set(battleCardsRef, { ...block });
		}

		await batch.commit();
	},
	battle: async ({ locals, request }) => {
		const data = await request.formData();
		const battleCards = data.get('battle_cards')?.toString();

		if (!battleCards) return;

		console.log('Sending cards...');

		const userUID = locals.userData.auth_data.uid;
		const selectedBattleCards = JSON.parse(battleCards) as BattleCard[];
		const batch = writeBatch(db);

		for (let i = 0; i < selectedBattleCards.length; i++) {
			const battleCardsRef = doc(db, `users/${userUID}/battle_cards/card_${i + 1}`);
			batch.set(battleCardsRef, { ...selectedBattleCards[i] });
		}

		await batch.commit();
	}
};
