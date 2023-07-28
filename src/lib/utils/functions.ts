import { blockCards, footworks, skills, strikeCards } from '$lib/data';
import type { BattleCard, BattleCards, Skill } from '$lib/types';

export function getRandomArnisSkill() {
	const randomSkillIndex = Math.floor(Math.random() * skills.length);
	const randomFootworkIndex = Math.floor(Math.random() * footworks.length);

	const randomSkill = skills[randomSkillIndex];
	const randomFootwork = footworks[randomFootworkIndex];

	return {
		skill: randomSkill,
		footwork: randomFootwork
	};
}

export function getRandomBattleCards(): BattleCards {
	let battlecards: BattleCards = {
		strikes: [],
		blocks: []
	};

	const strikes = [...strikeCards.keys()];
	const blocks = [...blockCards.keys()];

	for (let i = 0; i < 5; i++) {
		const randomStrike = getRandomBattleCard(strikes, 'strike');
		const randomBlock = getRandomBattleCard(blocks, 'block');

		battlecards.strikes.push(randomStrike);
		battlecards.blocks.push(randomBlock);
	}

	return battlecards;
}

function getRandomBattleCard(skills: string[], type: Skill) {
	const randomSkillIndex = Math.floor(Math.random() * skills.length);
	const randomSkills = skills[randomSkillIndex];

	let battlecard: BattleCard = {
		name: randomSkills,
		type,
		used: false
	};

	return battlecard;
}

// function getRandomStrikeCard(strikes: string[]): BattleCard {
// 	const randomStrikeIndex = Math.floor(Math.random() * strikes.length);
// 	const randomStrike = strikes[randomStrikeIndex];

// 	let battlecard: BattleCard = {
// 		name: randomStrike,
// 		type: 'strike',
// 		used: false
// 	};

// 	return battlecard;
// }

// function getRandomBlockCard(blocks: string[]): BattleCard {
// 	const randomBlockIndex = Math.floor(Math.random() * blocks.length);
// 	const randomBlock = blocks[randomBlockIndex];

// 	let battlecard: BattleCard = {
// 		name: randomBlock,
// 		type: 'strike',
// 		used: false
// 	};

// 	return battlecard;
// }
