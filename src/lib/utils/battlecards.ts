import { blockCards, strikeCards } from '$lib/data';
import { db } from '$lib/firebase/firebase';
import type { BattleCard, UserData } from '$lib/types';
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
	let PLAYER1_DMG = 0;
	let PLAYER2_DMG = 0;

	for (let i = 0; i < 6; i++) {
		const player1Card = player1Cards[i];
		const player2Card = player2Cards[i];

		// If both cards are blocks, do nothing
		console.log(`(${i}) Player 1: ${player1Card.name}`);
		console.log(`(${i}) Player 2: ${player2Card.name}`);

		const interaction = map.get(player1Card.type);

		if (!interaction) {
			console.log('No interaction');
			return;
		}

		console.log('Running interaction...');
		interaction[player2Card.type](player1Card, player2Card);

		// Otherwise, if one is a block, check which strike card the other player uses
		// if (player1Card.type === 'block') {
		// 	const blockCard = blockCards.get(player1Card.name);

		// 	if (!blockCard) {
		// 		console.log("Card doesn't exist.");
		// 		return;
		// 	}

		// 	if (player2Card.type === 'block') {
		// 		console.log('Both cards are blocks.');
		// 		continue;
		// 	} else if (player2Card.type === 'strike') {
		// 		const strikeCard = strikeCards.get(player2Card.name);

		// 		if (!strikeCard) {
		// 			console.log("Card doesn't exist.");
		// 			return;
		// 		}

		// 		const isCancelled = blockCard.strike_to_cancel === player2Card.name;

		// 		// If the strike is cancelled, apply the effects for successful cancellation
		// 		if (isCancelled) {
		// 			console.log(player2Card.name + ' was cancelled by ' + blockCard.name);
		// 		} else {
		// 			// If the strike wasn't cancelled and it hits, apply the effects for successful hit
		// 			const isHit = simulateAttack(strikeCard.accuracy);

		// 			if (isHit) {
		// 				console.log('Hit!');
		// 			}
		// 		}
		// 	}
		// } else if (player1Card.type === 'strike') {
		// 	const strikeCard = strikeCards.get(player2Card.name);

		// 	if (!strikeCard) {
		// 		console.log("Card doesn't exist.");
		// 		return;
		// 	}

		// 	if (player2Card.type === 'block') {
		// 		const blockCard = blockCards.get(player2Card.name);

		// 		if (!blockCard) {
		// 			console.log("Card doesn't exist.");
		// 			return;
		// 		}

		// 		const isCancelled = blockCard.name === player2Card.name;

		// 		// If the strike is cancelled, apply the effects for successful cancellation
		// 		if (isCancelled) {
		// 			console.log(player2Card.name + ' was cancelled by ' + blockCard.name);
		// 		} else {
		// 			// If the strike wasn't cancelled and it hits, apply the effects for successful hit
		// 			const isHit = simulateAttack(strikeCard.accuracy);

		// 			if (isHit) {
		// 				console.log('Hit!');
		// 			} else {
		// 				console.log('Missed!');
		// 			}
		// 		}
		// 	} else {
		// 		console.log('Both are strikes');
		// 	}
		// }
	}

	// Check which player has the highest score and set them as the winner
}

function simulateAttack(accuracy: number): boolean {
	const rng = Math.random();

	console.log('RNG: ' + rng);
	console.log('ACC: ' + accuracy);

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

const map = new Map([
	[
		'strike',
		{
			strike: (card1: BattleCard, card2: BattleCard) => {
				console.log('Both are strikes');
			},
			block: (card1: BattleCard, card2: BattleCard) => {
				const strike = strikeCards.get(card1.name);
				const block = blockCards.get(card2.name);

				if (!block || !strike) {
					console.error("Card doesn't exist");
					return;
				}

				const isCancelled = block.strike_to_cancel === strike.name;

				// If the strike is cancelled, apply the effects for successful cancellation
				if (isCancelled) {
					console.log(strike.name + ' was cancelled by ' + block.name);
				} else {
					// If the strike wasn't cancelled and it hits, apply the effects for successful hit
					const isHit = simulateAttack(strike.accuracy);

					if (isHit) {
						console.log('Hit!');
					}
				}
			}
		}
	],
	[
		'block',
		{
			strike: (card1: BattleCard, card2: BattleCard) => {
				const strike = strikeCards.get(card2.name);
				const block = blockCards.get(card1.name);

				if (!block || !strike) {
					console.error("Card doesn't exist");
					return;
				}

				const isCancelled = block.strike_to_cancel === strike.name;

				// If the strike is cancelled, apply the effects for successful cancellation
				if (isCancelled) {
					console.log(strike.name + ' was cancelled by ' + block.name);
				} else {
					// If the strike wasn't cancelled and it hits, apply the effects for successful hit
					const isHit = simulateAttack(strike.accuracy);

					if (isHit) {
						console.log('Hit!');
					}
				}
			},
			block: (card1: BattleCard, card2: BattleCard) => {
				console.log('Both are blocks');
			}
		}
	]
]);
