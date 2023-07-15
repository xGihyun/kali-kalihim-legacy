import {
	AncientsProtection,
	DoubleEdgedSword,
	ExtraWind,
	TwistOfFate,
	ViralxRival,
	WarlordsDomain
} from './components/powercards';
import {
	AncientsProtectionAbility,
	DoubleEdgedSwordAbility,
	ExtraWindAbility,
	TwistOfFateAbility,
	ViralxRivalAbility,
	WarlordsDomainAbility
} from './components/powercards/ability';
import {
	ancientsProtection,
	doubleEdgedSword,
	extraWind,
	twistOfFate,
	viralxRival,
	warlordsDomain
} from './components/powercards/ability/functions';
import type { PowerCard, Videos } from './types';

export const skills = [
	'Strikes',
	'Blocks',
	'Forward Sinawali',
	'Sideward Sinawali',
	'Reversed Sinawali'
];

export const footworks = ['Guerrero', 'Cabellero', 'Triangle', 'Reversed Triangle'];

// export let sectionsMap: Map<string, string> = new Map([
// 	['section-1', 'Section 1'],
// 	['section-2', 'Section 2'],
// 	['section-3', 'Section 3'],
// 	['section-4', 'Section 4'],
// 	['section-5', 'Section 5'],
// 	['section-6', 'Section 6'],
// 	['section-7', 'Section 7'],
// 	['section-8', 'Section 8'],
// 	['section-9', 'Section 9'],
// 	['section-10', 'Section 10'],
// 	['section-11', 'Section 11']
// ]);

export const powerCardsMap: Map<string, PowerCard> = new Map([
	[
		"warlord's-domain",
		{
			name: "Warlord's Domain",
			components: { card: WarlordsDomain, ability: WarlordsDomainAbility },
			function: warlordsDomain,
			used: false,
			description: 'Choose a specific skill to perform'
		}
	],
	[
		'double-edged-sword',
		{
			name: 'Double-edged Sword',
			components: { card: DoubleEdgedSword, ability: DoubleEdgedSwordAbility },
			function: doubleEdgedSword,
			used: false,
			description: 'Double points for a victory, double deduction for a loss'
		}
	],
	[
		'extra-wind',
		{
			name: 'Extra Wind',
			components: { card: ExtraWind, ability: ExtraWindAbility },
			function: extraWind,
			used: false,
			description: 'Get a new power card'
		}
	],
	[
		"ancient's-protection",
		{
			name: "Ancient's Protection",
			components: { card: AncientsProtection, ability: AncientsProtectionAbility },
			function: ancientsProtection,
			used: false,
			description: 'Deduction immunity'
		}
	],
	[
		'viral-x-rival',
		{
			name: 'Viral x Rival',
			components: { card: ViralxRival, ability: ViralxRivalAbility },
			function: viralxRival,
			used: false,
			description: 'Repeat current opponent for the next match'
		}
	],
	[
		'twist-of-fate',
		{
			name: 'Twist of Fate',
			components: { card: TwistOfFate, ability: TwistOfFateAbility },
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
		title: 'Star Reach',
		url: 'https://youtu.be/jrXYbouUFR8?t=694'
	}
];

export const rankLogoColors: Map<string, string> = new Map([
	['likas', 'border-white bg-red-600'],
	['likha', 'border-white bg-orange-800'],
	['lakan', 'border-black bg-amber-500'],
	['grandmaster', 'border-red-800 bg-red-600']
]);
