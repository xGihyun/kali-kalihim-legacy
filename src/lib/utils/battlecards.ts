import { blockCards, strikeCards } from '$lib/data';
import { db } from '$lib/firebase/firebase';
import type {
	BattleCard,
	BattleCardInteraction,
	Block,
	Damage,
	Skill,
	Strike,
	UserData
} from '$lib/types';
import { error } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';

export async function battle(player1: string, player2: string) {
	console.log(player1);
	console.log(player2);

	// Get cards of both players
	const player1Cards = await getPlayerCards(player1);
	const player2Cards = await getPlayerCards(player2);

	console.log('Player 1:');
	console.log(player1Cards);
	console.log('Player 2:');
	console.log(player2Cards);

	// Have a mutable variable for both player's HP
	let PLAYER_1_DMG = 0;
	let PLAYER_2_DMG = 0;

	for (let i = 0; i < 6; i++) {
		const player1Card = player1Cards[i];
		const player2Card = player2Cards[i];

		// If both cards are blocks, do nothing
		console.log('NEW TURN');
		console.log(`(${i}) Player 1: ${player1Card.name}`);
		console.log(`(${i}) Player 2: ${player2Card.name}`);

		const interaction = battleCardInteractions.get(player1Card.type);

		if (!interaction) {
			console.log('No interaction');
			return;
		}

		const damageDealt = interaction[player2Card.type](player1Card, player2Card);

		PLAYER_1_DMG += damageDealt.player1;
		PLAYER_2_DMG += damageDealt.player2;

		console.log(`(${i}) Player 1 Damage: ${PLAYER_1_DMG}`);
		console.log(`(${i}) Player 2 Damage: ${PLAYER_2_DMG}`);
	}

	console.log('TOTAL DAMAGE:');
	console.log('Player 1: ' + PLAYER_1_DMG);
	console.log('Player 2: ' + PLAYER_2_DMG);

	// Check which player has the highest score and set them as the winner
}

function simulateAttack(accuracy: number): boolean {
	const rng = Math.random();

	if (rng <= accuracy) {
		console.log('Hit!');
	} else {
		console.log('Miss!');
	}

	return rng <= accuracy;
}

async function getPlayerCards(uid: string): Promise<BattleCard[]> {
	const cardCollection = collection(db, `users/${uid}/battle_cards`);
	const getCards = await getDocs(cardCollection);
	const battleCards = getCards.docs
		.filter((card) => card.id.startsWith('card'))
		.map((card) => card.data() as BattleCard);

	return battleCards;
}

const noDamage: Damage = {
	player1: 0,
	player2: 0
};

// function getCard(card: BattleCard) {
// 	try {
// 		const validateCardType = battleCardMap.get(card.type);

// 		if (!validateCardType) {
// 			console.error("Card type doesn't exist");
// 			throw error;
// 		}

// 		const validateCard = validateCardType(card);

// 		if (!validateCard) {
// 			console.error("Card doesn't exist");
// 			throw error;
// 		}

// 		return validateCard;
// 	} catch (error) {
// 		console.error('Error in battle cards: ' + error);
// 		return 0;
// 	}
// }

const battleCardInteractions: BattleCardInteraction = new Map([
	[
		'strike',
		{
			strike: (card1: BattleCard, card2: BattleCard): Damage => {
				const strike1 = strikeCards.get(card1.name);
				const strike2 = strikeCards.get(card2.name);

				if (!strike1 || !strike2) {
					throw error(400, "Card doesn't exist");
				}

				const isHit1 = simulateAttack(strike1.accuracy);
				const isHit2 = simulateAttack(strike2.accuracy);

				// Return damage
				return {
					player1: isHit1 ? strike1.damage : 0,
					player2: isHit2 ? strike2.damage : 0
				};
			},
			block: (card1: BattleCard, card2: BattleCard): Damage => {
				const strike = strikeCards.get(card1.name);
				const block = blockCards.get(card2.name);

				if (!block || !strike) {
					throw error(400, "Card doesn't exist");
				}

				const isCancelled = block.strike_to_cancel === strike.name;

				// If the strike is cancelled, apply the effects for successful cancellation
				if (isCancelled) {
					console.log(strike.name + ' was cancelled by ' + block.name);
					return noDamage;
				}
				// If the strike wasn't cancelled and it hits, apply the effects for successful hit
				const isHit = simulateAttack(strike.accuracy);

				return {
					player1: isHit ? strike.damage : 0,
					player2: 0
				};
			}
		}
	],
	[
		'block',
		{
			strike: (card1: BattleCard, card2: BattleCard): Damage => {
				const strike = strikeCards.get(card2.name);
				const block = blockCards.get(card1.name);

				if (!block || !strike) {
					throw error(400, "Card doesn't exist");
				}

				const isCancelled = block.strike_to_cancel === strike.name;

				// If the strike is cancelled, apply the effects for successful cancellation
				if (isCancelled) {
					console.log(strike.name + ' was cancelled by ' + block.name);
					return noDamage;
				}

				// If the strike wasn't cancelled and it hits, apply the effects for successful hit
				const isHit = simulateAttack(strike.accuracy);

				return {
					player1: 0,
					player2: isHit ? strike.damage : 0
				};
			},
			block: (card1: BattleCard, card2: BattleCard): Damage => {
				console.log('Both are blocks');
				return noDamage;
			}
		}
	]
]);
