import type { Timestamp } from 'firebase/firestore';
import type { ComponentType, SvelteComponent } from 'svelte';

// USER

export type UserData = {
	auth_data: UserAuthData;
	personal_data: UserPersonalData;
	score: number;
	rank: UserRankingData;
	power_cards: UserPowerCard[];
	is_private: boolean;
};

export type UserAuthData = {
	username: string | null;
	email: string;
	photo_url: string | null;
	banner_url?: string;
	is_logged_in: boolean;
	uid: string;
	is_registered: boolean;
	role: string;
};

export type UserPersonalData = {
	name: {
		first: string;
		last: string;
	};
	sex: string;
	section: string;
	age: number;
	contact_number: number;
};

export type UserRankingData = {
	number: {
		overall: number;
		section: number;
	};
	title: string;
};

export type UserPowerCard = {
	activated: boolean;
	key: string;
	name: string;
	used: boolean;
};

// MATCH

export type Match = {
	players: UserData[];
	section: string;
	skill: string;
	footwork: string;
	status: string;
	timestamp: Timestamp;
	uids?: string[];
};

export type ArnisMatchHistory = {
	players: UserData[];
	skill: string;
	footwork: string;
	timestamp: Timestamp;
	// winner: UserData;
};

export type MatchSet = {
	section: string;
	set: number;
	status: string;
	timestamp: Timestamp;
	timer_expired: boolean;
};

export type MatchSetWithId = {
	match: MatchSet;
	id: string;
};

export type Section = {
	name: string;
	id: string;
};

// POWER CARD

export type PowerCard = {
	components: {
		ability: ComponentType<SvelteComponent>;
	};
	name: string;
	function: (...T: any) => Promise<typeof T>;
	used: boolean;
	description?: string;
	image_url?: string;
};

// NAVIGATION

export type Navigation = {
	name: string;
	path: string;
	icon?: ComponentType<SvelteComponent>;
}[];

export type Video = {
	title: string;
	url: string;
};

// BATTLE CARDS

export type Effect = {
	type: 'increase' | 'decrease';
	amount: number;
	stat: 'accuracy' | 'damage';
	target: 'self' | 'opponent';
};

export type Block = {
	name: string;
	reduction: number;
	strike_to_cancel: string;
	effect: Effect;
};

export type Strike = {
	name: string;
	damage: number;
	accuracy: number;
	effect: Effect;
};

export type Skill = 'strike' | 'block';

export type BattleCard = {
	name: string;
	skill: Skill;
};

export type BattleCards = {
	strikes: BattleCard[];
	blocks: BattleCard[];
};

export type Damage = {
	player1: number;
	player2: number;
};

export type BattleCardTurn = {
	damage: number;
	is_cancelled: boolean;
};

export type BattleCardTurns = {
	player_1: BattleCardTurn[];
	player_2: BattleCardTurn[];
};

export type BattleCardResults = {
	uid: string;
	totalDamage: number | null;
	turns: BattleCardTurn[];
	battle_cards: BattleCard[];
};

export interface PlayerWithDamage extends UserData {
	total_damage: number | null;
	turns: BattleCardTurn[];
	battle_cards: BattleCard[];
}

export type CardBattle = {
	players: PlayerWithDamage[];
};

export type MatchSets = {
	id: string;
	data: MatchSet;
};

export type LoadState = 'initial' | 'loading' | 'done';
