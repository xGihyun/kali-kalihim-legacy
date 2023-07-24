import {
	AncientsProtection,
	DoubleEdgedSword,
	ExtraWind,
	TwistOfFate,
	ViralxRival,
	WarlordsDomain
} from './components/powercards';
import {
	ancientsProtection,
	doubleEdgedSword,
	extraWind,
	twistOfFate,
	viralxRival,
	warlordsDomain
} from './components/powercards/functions';
import type { PowerCard, Videos } from './types';

export const skills = [
	'Strikes',
	'Blocks',
	'Forward Sinawali',
	'Sideward Sinawali',
	'Reversed Sinawali'
];

export const footworks = ['Guerrero', 'Cabellero', 'Triangle', 'Reversed Triangle'];

export const powerCardsMap: Map<string, PowerCard> = new Map([
	[
		"warlord's-domain",
		{
			name: "Warlord's Domain",
			components: { ability: WarlordsDomain },
			function: warlordsDomain,
			used: false,
			description: 'Choose a specific skill to perform'
		}
	],
	[
		'double-edged-sword',
		{
			name: 'Double-edged Sword',
			components: { ability: DoubleEdgedSword },
			function: doubleEdgedSword,
			used: false,
			description: 'Double points for a victory, double deduction for a loss'
		}
	],
	[
		'extra-wind',
		{
			name: 'Extra Wind',
			components: { ability: ExtraWind },
			function: extraWind,
			used: false,
			description: 'Get a new power card'
		}
	],
	[
		"ancient's-protection",
		{
			name: "Ancient's Protection",
			components: { ability: AncientsProtection },
			function: ancientsProtection,
			used: false,
			description: 'Deduction immunity'
		}
	],
	[
		'viral-x-rival',
		{
			name: 'Viral x Rival',
			components: { ability: ViralxRival },
			function: viralxRival,
			used: false,
			description: 'Repeat current opponent for the next match'
		}
	],
	[
		'twist-of-fate',
		{
			name: 'Twist of Fate',
			components: { ability: TwistOfFate },
			function: twistOfFate,
			used: false,
			description: 'Switch opponent for the current match'
		}
	]
]);

export const arnisSkills: Videos = [
	{
		title: 'Strikes',
		url: 'https://youtu.be/9ImJFGii6lg'
	},
	{
		title: 'Blocks',
		url: 'https://youtu.be/vsTbagtEiyA'
	},
	{
		title: 'Forward Sinawali',
		url: 'https://youtu.be/0VTyA7fAoNg'
	},
	{
		title: 'Sideward Sinawali',
		url: 'https://youtu.be/GbHiKTmVgJw?t=85'
	},
	{
		title: 'Reverse Sinawali',
		url: 'https://youtu.be/GbHiKTmVgJw?t=343'
	}
];

export const arnisFootworks: Videos = [
	{
		title: 'Caballero',
		url: 'https://youtu.be/jrXYbouUFR8?t=312'
	},
	{
		title: 'Triangle',
		url: 'https://youtu.be/jrXYbouUFR8?t=457'
	},
	{
		title: 'Reversed Triangle',
		url: 'https://youtu.be/jrXYbouUFR8?t=591'
	},
	{
		title: 'Star Reach',
		url: 'https://youtu.be/jrXYbouUFR8?t=694'
	}
];

export const rankLogoColors: Map<string, string> = new Map([
	['likas', 'border-white bg-gradient-to-l from-red-900 to-red-600'],
	['likha', 'border-white bg-gradient-to-l from-orange-900 to-orange-500'],
	['lakan', 'border-black bg-gradient-to-l from-amber-900 to-amber-500'],
	['grandmaster', 'border-red-800 bg-gradient-to-l from-red-900 to-red-600']
]);
