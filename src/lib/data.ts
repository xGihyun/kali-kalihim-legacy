import {
	ancients_protection,
	double_edged_sword,
	extra_wind,
	twist_of_fate,
	viral_x_rival,
	warlords_domain
} from './assets/images/cards';
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
import type { Block, PowerCard, Strike, Video } from './types';

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
			description: {
				full: 'The player can select a specific skill to perform on their upcoming match. If the opponent uses the same card, the effect will be cancelled.',
				summarized: 'Choose a specific skill to perform'
			},
			image_url: warlords_domain
		}
	],
	[
		'double-edged-sword',
		{
			name: 'Double-edged Sword',
			components: { ability: DoubleEdgedSword },
			function: doubleEdgedSword,
			used: false,
			description: {
				full: 'The player will be rewarded double the points after winning the Arnis match, otherwise, the player will receive double deduction.',
				summarized: 'Double points for a victory, double deduction for a loss'
			},
			image_url: double_edged_sword
		}
	],
	[
		'extra-wind',
		{
			name: 'Extra Wind',
			components: { ability: ExtraWind },
			function: extraWind,
			used: false,
			description: {
				full: 'The player can select a new power card, excluding Extra Wind.',
				summarized: 'Get a new power card'
			},
			image_url: extra_wind
		}
	],
	[
		"ancient's-protection",
		{
			name: "Ancient's Protection",
			components: { ability: AncientsProtection },
			function: ancientsProtection,
			used: false,
			description: {
				full: "The player won't receive deduction if they lose the Arnis match.",
				summarized: 'Deduction immunity'
			},

			image_url: ancients_protection
		}
	],
	[
		'viral-x-rival',
		{
			name: 'Viral x Rival',
			components: { ability: ViralxRival },
			function: viralxRival,
			used: false,
			description: {
				full: "The player's current opponent will also be their opponent for the next match.",
				summarized: 'Repeat current opponent for the next match'
			},

			image_url: viral_x_rival
		}
	],
	[
		'twist-of-fate',
		{
			name: 'Twist of Fate',
			components: { ability: TwistOfFate },
			function: twistOfFate,
			used: false,
			description: {
				full: 'The player can change their opponent on the upcoming Arnis match.',
				summarized: 'Switch opponent for the current match'
			},

			image_url: twist_of_fate
		}
	]
]);

export const arnisSkills: Video[] = [
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

export const arnisFootworks: Video[] = [
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
			accuracy: 0.9,
			effect: {
				type: 'increase',
				amount: 0.1,
				stat: 'accuracy',
				target: 'self'
			}
		}
	],
	[
		'Temple Strike',
		{
			name: 'Temple Strike',
			damage: 10,
			accuracy: 0.75,
			effect: {
				type: 'decrease',
				amount: 0.1,
				stat: 'accuracy',
				target: 'opponent'
			}
		}
	],
	[
		'Shoulder Strike',
		{
			name: 'Shoulder Strike',
			damage: 10,
			accuracy: 0.8,
			effect: {
				type: 'decrease',
				amount: 0.1,
				stat: 'accuracy',
				target: 'opponent'
			}
		}
	],
	[
		'Shoulder Thrust',
		{
			name: 'Shoulder Thrust',
			damage: 8,
			accuracy: 0.85,
			effect: {
				type: 'decrease',
				amount: 0.1,
				stat: 'accuracy',
				target: 'opponent'
			}
		}
	],
	[
		'Eye Poke',
		{
			name: 'Eye Poke',
			damage: 12,
			accuracy: 0.6,
			effect: {
				type: 'increase',
				amount: 0.15,
				stat: 'accuracy',
				target: 'opponent'
			}
		}
	],
	[
		'Stomach Thrust',
		{
			name: 'Stomach Thrust',
			damage: 10,
			accuracy: 0.85,
			effect: {
				type: 'increase',
				amount: 0.5,
				stat: 'damage',
				target: 'self'
			}
		}
	],
	[
		'Head Strike',
		{
			name: 'Head Strike',
			damage: 18,
			accuracy: 0.5,
			effect: {
				type: 'decrease',
				amount: 0.15,
				stat: 'accuracy',
				target: 'opponent'
			}
		}
	]
]);

export const blockCards: Map<string, Block> = new Map([
	[
		'Leg Strike Block',
		{
			name: 'Leg Strike Block',
			reduction: 0.1,
			strike_to_cancel: 'Leg Strike',
			effect: {
				type: 'increase',
				amount: 0.1,
				stat: 'accuracy',
				target: 'self'
			}
		}
	],
	[
		'Temple Strike Block',
		{
			name: 'Temple Strike Block',
			reduction: 0.15,
			strike_to_cancel: 'Temple Strike',
			effect: {
				type: 'decrease',
				amount: 0.1,
				stat: 'accuracy',
				target: 'opponent'
			}
		}
	],
	[
		'Shoulder Strike Block',
		{
			name: 'Shoulder Strike Block',
			reduction: 0.15,
			strike_to_cancel: 'Shoulder Strike',
			effect: {
				type: 'decrease',
				amount: 0.1,
				stat: 'accuracy',
				target: 'opponent'
			}
		}
	],
	[
		'Shoulder Thrust Block',
		{
			name: 'Shoulder Thrust Block',
			reduction: 0.15,
			strike_to_cancel: 'Shoulder Thrust',
			effect: {
				type: 'decrease',
				amount: 0.1,
				stat: 'accuracy',
				target: 'opponent'
			}
		}
	],
	[
		'Eye Poke Block',
		{
			name: 'Eye Poke Block',
			reduction: 0.15,
			strike_to_cancel: 'Eye Poke',
			effect: {
				type: 'decrease',
				amount: 0.1,
				stat: 'damage',
				target: 'opponent'
			}
		}
	],
	[
		'Stomach Thrust Block',
		{
			name: 'Stomach Thrust Block',
			reduction: 0.15,
			strike_to_cancel: 'Stomach Thrust',
			effect: {
				type: 'increase',
				amount: 0.5,
				stat: 'damage',
				target: 'self'
			}
		}
	],
	[
		'Head Strike Block',
		{
			name: 'Head Strike Block',
			reduction: 0.15,
			strike_to_cancel: 'Head Strike',
			effect: {
				type: 'decrease',
				amount: 0.2,
				stat: 'damage',
				target: 'opponent'
			}
		}
	]
]);
