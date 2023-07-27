import { Guide, History, People, Sword, Trophy } from './assets/icons';
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
		name: 'Rankings',
		path: '/leaderboards',
		icon: Trophy
	},
	{
		name: 'Guide',
		path: '/guide',
		icon: Guide
	},
	{
		name: 'Battle',
		path: '/battle',
		icon: Sword,
	}
];
