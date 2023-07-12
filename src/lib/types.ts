import type { Timestamp } from 'firebase/firestore';

export type UserData = {
	auth_data: UserAuthData;
	personal_data: UserPersonalData;
	score: number;
	rank: UserRankingData;
	power_cards: UserPowerCard[];
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

export type PowerCard = {
	components: {
		card: ConstructorOfATypedSvelteComponent;
		ability: ConstructorOfATypedSvelteComponent;
	};
	name: string;
	function: (...T: any) => Promise<typeof T>;
	used: boolean;
	description?: string;
};

export type Navigation = {
	name: string;
	path: string;
	icon?: ConstructorOfATypedSvelteComponent;
}[];

type Video = {
	title: string;
	url: string;
}

export type Videos = Video[];

export type Section = {
	name: string;
}