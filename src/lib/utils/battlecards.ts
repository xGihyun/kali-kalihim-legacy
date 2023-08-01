import { blockCards, strikeCards } from '$lib/data';
import { db } from '$lib/firebase/firebase';
import type {
	BattleCard,
	BattleCardInteraction,
	BattleCardResults,
	Block,
	Damage,
	Skill,
	Strike,
	UserData
} from '$lib/types';
import { error } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';
import { card_battle } from '$lib/pkg/my_package';

export async function battle(player1: string, player2: string): Promise<string> {
	console.log(player1);
	console.log(player2);

	const player1Cards = await getPlayerCards(player1);
	const player2Cards = await getPlayerCards(player2);

	console.log('Player 1:');
	console.log(player1Cards);
	console.log('Player 2:');
	console.log(player2Cards);

	const player1CardsStr = JSON.stringify(player1Cards);
	const player2CardsStr = JSON.stringify(player2Cards);

	const battleResults: BattleCardResults = card_battle(player1CardsStr, player2CardsStr);

	let player1TotalDamage = 0;
	let player2TotalDamage = 0;

	battleResults.player_1.forEach((result) => {
		if (!result.is_cancelled) {
			player1TotalDamage += result.damage;
		}
	});

	battleResults.player_2.forEach((result) => {
		if (!result.is_cancelled) {
			player2TotalDamage += result.damage;
		}
	});

	console.log(player1TotalDamage);
	console.log(player2TotalDamage);

	return player1TotalDamage > player2TotalDamage ? player1 : player2;
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

function getStrikeCard(card: BattleCard): Strike {
	const battleCard = strikeCards.get(card.name);
	if (!battleCard) {
		throw error(400, "Card doesn't exist");
	}
	return battleCard;
}

function getBlockCard(card: BattleCard): Block {
	const battleCard = blockCards.get(card.name);
	if (!battleCard) {
		throw error(400, "Card doesn't exist");
	}
	return battleCard;
}

const battleCardInteractions: BattleCardInteraction = new Map([
	[
		'strike',
		{
			strike: (
				card1: BattleCard,
				card2: BattleCard,
				prevCard1?: BattleCard,
				prevCard2?: BattleCard
			): Damage => {
				let strike1 = getStrikeCard(card1);
				let strike2 = getStrikeCard(card2);

				// Apply effects based on previous card
				// This code is horrible
				if (prevCard1 && prevCard2) {
					console.log('PREVIOUS CARDS:');
					console.log(prevCard1);
					console.log(prevCard2);

					switch (prevCard1.skill) {
						case 'block': {
							// const prevCard = getBlockCard(prevCard1);
							// const statToChange = prevCard.effect.stat;
							// const amount =
							// 	prevCard.effect.type === 'increase'
							// 		? 1 + prevCard.effect.number
							// 		: 1 - prevCard.effect.number;
							// console.log('STAT TO CHANGE: ' + prevCard.effect.type + statToChange);
							// console.log('BEFORE: ' + strike1[statToChange]);
							// console.log('AFTER: ' + strike1[statToChange] * amount);
							// strike1[statToChange] *= amount;
						}
						case 'strike': {
							const prevCard = getStrikeCard(prevCard1);
							const statToChange = prevCard.effect.stat;
							const amount =
								prevCard.effect.type === 'increase'
									? 1 + prevCard.effect.number
									: 1 - prevCard.effect.number;

							console.log('STAT TO CHANGE: ' + prevCard.effect.type + statToChange);
							console.log('BEFORE: ' + strike1[statToChange]);
							console.log('AFTER: ' + strike1[statToChange] * amount);
							strike1[statToChange] *= amount;
						}
						default:
							console.error('Unknown skill type in previous card 1');
					}

					switch (prevCard2.skill) {
						case 'block': {
							// const prevCard = getBlockCard(prevCard2);
							// const statToChange = prevCard.effect.stat;
							// const amount =
							// 	prevCard.effect.type === 'increase'
							// 		? 1 + prevCard.effect.number
							// 		: 1 - prevCard.effect.number;
							// console.log('STAT TO CHANGE: ' + prevCard.effect.type + statToChange);
							// console.log('BEFORE: ' + strike2[statToChange]);
							// console.log('AFTER: ' + strike2[statToChange] * amount);
							// strike2[statToChange] *= amount;
						}
						case 'strike': {
							const prevCard = getStrikeCard(prevCard2);
							const statToChange = prevCard.effect.stat;
							const amount =
								prevCard.effect.type === 'increase'
									? 1 + prevCard.effect.number
									: 1 - prevCard.effect.number;

							console.log('STAT TO CHANGE: ' + prevCard.effect.type + statToChange);
							console.log('BEFORE: ' + strike2[statToChange]);
							console.log('AFTER: ' + strike2[statToChange] * amount);
							// strike2[statToChange] *= amount;
						}
						default:
							console.error('Unknown skill type in previous card 2');
					}

					console.log('AFTER EFFECTS:');
					console.log(strike1);
					console.log(strike2);
				}

				const isHit1 = simulateAttack(strike1.accuracy);
				const isHit2 = simulateAttack(strike2.accuracy);

				// Return damage
				return {
					player1: isHit1 ? strike1.damage : 0,
					player2: isHit2 ? strike2.damage : 0
				};
			},
			block: (
				card1: BattleCard,
				card2: BattleCard,
				prevCard1?: BattleCard,
				prevCard2?: BattleCard
			): Damage => {
				let strike = strikeCards.get(card1.name);
				let block = blockCards.get(card2.name);

				if (!block || !strike) {
					throw error(400, "Card doesn't exist");
				}

				const isCancelled = block.strike_to_cancel === strike.name;

				// If the strike is cancelled, apply the effects for successful cancellation
				if (isCancelled) {
					console.log(strike.name + ' was cancelled by ' + block.name);
					return noDamage;
				}

				if (prevCard1 && prevCard2) {
					switch (prevCard1.skill) {
						case 'block': {
							console.log('Block');
							// const prevCard = getBlockCard(prevCard1);
							// const statToChange = prevCard.effect.stat;
							// const amount =
							// 	prevCard.effect.type === 'increase'
							// 		? 1 + prevCard.effect.number
							// 		: 1 - prevCard.effect.number;

							// console.log('BLOCK WILL CHANGE STAT: ' + prevCard.effect.type + statToChange);
							// console.log('BEFORE: ' + strike[statToChange]);
							// console.log('AFTER: ' + strike[statToChange] * amount);
							// strike[statToChange] *= amount;
						}
						case 'strike': {
							// const prevCard = getStrikeCard(prevCard1);
							// const statToChange = prevCard.effect.stat;
							// const amount =
							// 	prevCard.effect.type === 'increase'
							// 		? 1 + prevCard.effect.number
							// 		: 1 - prevCard.effect.number;
							// console.log('STRIKE WILL CHANGE STAT: ' + prevCard.effect.type + statToChange);
							// console.log('BEFORE: ' + strike[statToChange]);
							// console.log('AFTER: ' + strike[statToChange] * amount);
							// strike[statToChange] *= amount;
						}
						default:
							console.error('Unknown skill type in previous card 1');
					}
					switch (prevCard2.skill) {
						case 'block': {
							// const prevCard = getBlockCard(prevCard2);
							// const statToChange = prevCard.effect.stat;
							// const amount =
							// 	prevCard.effect.type === 'increase'
							// 		? 1 + prevCard.effect.number
							// 		: 1 - prevCard.effect.number;
							// console.log('STAT TO CHANGE: ' + prevCard.effect.type + statToChange);
							// console.log('BEFORE: ' + strike[statToChange]);
							// console.log('AFTER: ' + strike[statToChange] * amount);
							// strike[statToChange] *= amount;
						}
						case 'strike': {
							// const prevCard = getStrikeCard(prevCard2);
							// const statToChange = prevCard.effect.stat;
							// const amount =
							// 	prevCard.effect.type === 'increase'
							// 		? 1 + prevCard.effect.number
							// 		: 1 - prevCard.effect.number;
							// console.log('STAT TO CHANGE: ' + prevCard.effect.type + statToChange);
							// console.log('BEFORE: ' + strike[statToChange]);
							// console.log('AFTER: ' + strike[statToChange] * amount);
							// strike[statToChange] *= amount;
						}
						default:
							console.error('Unknown skill type in previous card 2');
					}

					console.log('AFTER EFFECTS:');
					console.log(strike);
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
