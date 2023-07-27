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
import type { Block, Blocks, PowerCard, Strike, Strikes, Videos } from './types';

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

export const strikeCards: Map<string, Strike> = new Map([
	[
		'Leg Strike',
		{
			name: 'Leg Strike',
			damage: 5,
			accuracy: 0.9
		}
	],
	[
		'Temple Strike',
		{
			name: 'Temple Strike',
			damage: 10,
			accuracy: 0.75
		}
	],
	[
		'Shoulder Strike',
		{
			name: 'Shoulder Strike',
			damage: 10,
			accuracy: 0.8
		}
	],
	[
		'Shoulder Thrust',
		{
			name: 'Shoulder Thrust',
			damage: 8,
			accuracy: 0.85
		}
	],
	[
		'Eye Poke',

		{
			name: 'Eye Poke',
			damage: 12,
			accuracy: 0.6
		}
	],
	[
		'Stomatch Thrust',
		{
			name: 'Stomach Thrust',
			damage: 10,
			accuracy: 0.85
		}
	],
	[
		'Head Strike',
		{
			name: 'Head Strike',
			damage: 18,
			accuracy: 0.5
		}
	]
]);

export const blockCards: Map<string, Block> = new Map([
	[
		'Leg Strike Block',
		{
			name: 'Leg Strike Block',
			reduction: 0.1,
			strike_to_cancel: 'Leg Strike'
		}
	],
	[
		'Temple Strike Block',
		{
			name: 'Temple Strike Block',
			reduction: 0.15,
			strike_to_cancel: 'Temple Strike'
		}
	],
	[
		'Shoulder Strike Block',
		{
			name: 'Shoulder Strike Block',
			reduction: 0.15,
			strike_to_cancel: 'Shoulder Strike'
		}
	],
	[
		'Shoulder Thrust Block',
		{
			name: 'Shoulder Thrust Block',
			reduction: 0.15,
			strike_to_cancel: 'Shoulder Thrust'
		}
	],
	[
		'Eye Poke Block',
		{
			name: 'Eye Poke Block',
			reduction: 0.15,
			strike_to_cancel: 'Eye Poke'
		}
	],
	[
		'Stomach Thrust Block',
		{
			name: 'Stomach Thrust Block',
			reduction: 0.15,
			strike_to_cancel: 'Stomach Thrust'
		}
	],
	[
		'Head Strike Block',
		{
			name: 'Head Strike Block',
			reduction: 0.15,
			strike_to_cancel: 'Head Strike'
		}
	]
]);
