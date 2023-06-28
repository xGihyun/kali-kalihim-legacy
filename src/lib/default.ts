import type {
	UserAuthData,
	UserData,
	UserPersonalData,
	UserPowerCard,
	UserRankingData
} from './types';

export const defaultAuthData: UserAuthData = {
	email: '',
	username: '',
	uid: '',
	is_logged_in: false,
	is_registered: false,
	photo_url: '',
	role: ''
};

export const defaultPersonalData: UserPersonalData = {
	age: -1,
	contact_number: -1,
	name: {
		first: '',
		last: ''
	},
	section: '',
	sex: ''
};

export const defaultRankingData: UserRankingData = {
	number: {
		overall: 0,
		section: 0
	},
	title: ''
};

export const defaultPowerCards: UserPowerCard[] = [];

export const defaultUserData: UserData = {
	auth_data: defaultAuthData,
	personal_data: defaultPersonalData,
	score: 0,
	rank: defaultRankingData,
	power_cards: defaultPowerCards
};
