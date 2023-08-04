import { db } from '$lib/firebase/firebase';
import type { BattleCard, BattleCardResults, BattleCardTurns } from '$lib/types';
import { collection, getDocs } from 'firebase/firestore';
import { card_battle } from '$lib/pkg/my_package';

export async function battle(player1: string, player2: string): Promise<BattleCardResults[]> {
	const [player1Cards, player2Cards] = await Promise.all([
		getPlayerCards(player1),
		getPlayerCards(player2)
	]);

	console.log('Player 1:');
	console.log(player1Cards);
	console.log('Player 2:');
	console.log(player2Cards);

	const player1CardsStr = JSON.stringify(player1Cards);
	const player2CardsStr = JSON.stringify(player2Cards);

	let player1TotalDamage: number | null = player1Cards.length > 0 ? 0 : null;
	let player2TotalDamage: number | null = player2Cards.length > 0 ? 0 : null;

	if (player1TotalDamage !== null && player2TotalDamage !== null) {
		const battleResults: BattleCardTurns = card_battle(player1CardsStr, player2CardsStr);

		battleResults.player_1.forEach((result) => {
			if (!result.is_cancelled) {
				player1TotalDamage! += result.damage;
			}
		});

		battleResults.player_2.forEach((result) => {
			if (!result.is_cancelled) {
				player2TotalDamage! += result.damage;
			}
		});
	}

	let results: BattleCardResults[] = [
		{
			totalDamage: player1TotalDamage,
			uid: player1
		},
		{
			totalDamage: player2TotalDamage,
			uid: player2
		}
	];

	return results;
}

async function getPlayerCards(uid: string): Promise<BattleCard[]> {
	const cardCollection = collection(db, `users/${uid}/battle_cards`);

	try {
		const getCards = await getDocs(cardCollection);
		const battleCards = getCards.docs
			.filter((card) => card.id.startsWith('card'))
			.map((card) => card.data() as BattleCard);

		return battleCards;
	} catch (err) {
		throw new Error('Error getting player cards: ' + err);
	}
}
