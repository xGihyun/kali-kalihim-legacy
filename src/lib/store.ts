import { writable } from 'svelte/store';
import type { UserData } from './types';
import { defaultUserData } from './default';

export const currentUser = writable<UserData>({
	...defaultUserData
});

export const allUsers = writable<UserData[]>([]);
export const selectedPowerCard = writable<string | null>(null);
