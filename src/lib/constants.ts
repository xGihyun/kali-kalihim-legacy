import { History, People, Sword } from './assets/icons';
import type { Navigation } from './types';

export const CACHE_DURATION = 600;

export const ADMIN_ROUTES: Navigation = [
	{
		name: 'Queue',
		path: '/matchmake',
		icon: Sword
	},
	{
		name: 'Matches',
		path: '/pending-matches',
		icon: History
	},
	{
		name: 'Users',
		path: '/manage-users',
		icon: People
	}
];

export const USER_ROUTES: Navigation = [
	{
		name: 'Leaderboards',
		path: '/leaderboards'
	}
];
