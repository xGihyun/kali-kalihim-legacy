import { writable } from 'svelte/store';
import { defaultUserData } from './default';
import type { UserData } from './types';

export const currentUser = writable<UserData>({
	...defaultUserData
});

export const selectedPowerCard = writable<string | null>(null);
export const latestOpponent = writable<UserData>();
export const allUsersInSection = writable<UserData[]>([]);
// export const sections = writable<Map<string, string>>();
// export const battleCards = writable<any>([]);
// export const matchResults = writable<Promise<Match[]>>();
// export const matchSetId = writable<string>();
export const section = writable<string>();
export const timerExpired = writable<boolean>(false);
