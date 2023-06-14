import { writable } from 'svelte/store';
import type { UserData } from './types';

export const currentUser = writable<UserData>({
	auth_data: {
		email: '',
		username: '',
		uid: '',
		is_logged_in: false,
		is_registered: false,
		photo_url: '',
		role: ''
	},
	personal_data: {
		age: -1,
		contact_number: -1,
		name: {
			first: '',
			last: ''
		},
		section: '',
		sex: ''
	},
	score: 0
});

export const allUsers = writable<UserData[]>([]);
