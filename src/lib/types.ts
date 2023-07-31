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
export type Change = 'increase' | 'decrease';
export type Stat = 'accuracy' | 'damage';

export type Effect = {
	type: Change;
	number: number;
	stat: Stat;
};

// It's probably better to do some OOP stuff here but nevermind for now
export type Strike = {
	name: string;
	damage: number;
	accuracy: number;
	effect: Effect;
};

export type Block = {
	name: string;
	reduction: number;
	strike_to_cancel: string;
	effect: Effect;
};

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

// export type BattleCardEffects = Map<Stat, 

// export type GetBattleCard = {
// 	'strike': (card: BattleCard) => Strike | undefined,
// 	'block': (card: BattleCard) => Block | undefined,
// }

// export type GetBattleCard = {
// 	[key in Skill]: (
// 		card: BattleCard
// 	) => key extends 'strike' ? Strike | undefined : Block | undefined;
// };

// export type GetBattleCard = {
// 	[key in Skill]: (card: BattleCard) => Strike | Block | undefined
// }
// export type AuthState = 'logged_in' | 'registered' | 'logged_out'
