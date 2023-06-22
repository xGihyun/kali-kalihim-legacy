import type { Timestamp } from 'firebase/firestore';

export type UserData = {
	auth_data: UserAuthData;
	personal_data: UserPersonalData;
	score: number;
	rank: {
		number: number;
		title: string;
	};
};

export type UserAuthData = {
	username: string | null;
	email: string | null;
	photo_url: string | null;
	is_logged_in: boolean;
	uid: string | null;
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

export type PendingMatch = {
	players: UserData[];
	section: string;
	skill: string;
	footwork: string;
	timestamp: Timestamp;
};

export type MatchSet = {
	section: string;
	set: number;
	status: string;
};
