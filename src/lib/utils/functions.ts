import { blockCards, footworks, skills, strikeCards } from '$lib/data';
import { db } from '$lib/firebase/firebase';
import type {
	BattleCard,
	BattleCards,
	CardBattle,
	Match,
	MatchSet,
	MatchSets,
	Section,
	Skill
} from '$lib/types';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

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

function getRandomBattleCard(skills: string[], skill: Skill) {
	const randomSkillIndex = Math.floor(Math.random() * skills.length);
	const randomSkills = skills[randomSkillIndex];

	const battlecard: BattleCard = {
		name: randomSkills,
		skill
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

export async function getSections(): Promise<Map<string, string>> {
	const sectionsCollection = collection(db, 'sections');
	const getSections = await getDocs(sectionsCollection);

	if (getSections.empty) {
		console.error('No sections yet');
	}

	const sections: Map<string, string> = getSections.docs.reduce((result, section) => {
		const sectionData = section.data() as Section;
		const value = sectionData.name;
		const key = section.id;

		result.set(key, value);

		return result;
	}, new Map());

	return sections;
}

export function formatSection(section: string): string {
	const formatted = section.replace('_', ' ').charAt(0).toUpperCase() + section.slice(1);

	return formatted;
}

export async function getMatchSets(section: string) {
	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const matchSetsDocs = await getDocs(matchQuery);

	// if (matchSetsDocs.empty) {
	// 	return;
	// }

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

	return matchSets;
}
