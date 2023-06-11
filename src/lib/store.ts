import { writable } from 'svelte/store';
import type { UserData } from './types';

export const currentUser = writable<UserData>({
	auth_data: {
		email: '',
		username: '',
		uid: '',
		is_logged_in: false,
		photo_url: ''
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
	}
});

export const allUsers = writable<UserData[]>([]);
