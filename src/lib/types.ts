import type { Timestamp } from 'firebase/firestore';

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

export type MatchSet = {
	section: string;
	set: number;
	status: string;
};

export type Section = {
	name: string;
};

// POWER CARD

export type PowerCard = {
	components: {
		ability: ConstructorOfATypedSvelteComponent;
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
	icon?: ConstructorOfATypedSvelteComponent;
}[];

export type Video = {
	title: string;
	url: string;
};

// BATTLE CARDS

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

export type BattleCardInteraction = Map<
	Skill,
	{
		[key in Skill]: (
			card1: BattleCard,
			card2: BattleCard,
			prevCard1?: BattleCard,
			prevCard2?: BattleCard
		) => Damage;
	}
>;

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
};

export interface PlayerWithDamage extends UserData {
	total_damage: number | null;
}

export type CardBattle = {
	players: PlayerWithDamage[];
};
