import { writable } from 'svelte/store';
import type { Section, UserData } from './types';
import { defaultUserData } from './default';

export const currentUser = writable<UserData>({
	...defaultUserData
});

export const selectedPowerCard = writable<string | null>(null);
export const latestOpponent = writable<UserData>();
export const allUsersInSection = writable<UserData[]>([]);
export const sections = writable<Map<string, string>>();