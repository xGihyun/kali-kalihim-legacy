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
import type { PowerCard } from './types';

export const skills = [
	'Strikes',
	'Blocks',
	'Forward Sinawali',
	'Sideward Sinawali',
	'Reversed Sinawali'
];

export const footworks = ['Guerrero', 'Cabellero', 'Triangle', 'Reversed Triangle'];

export const sectionsMap: Map<string, string> = new Map([
	['section-1', 'Section 1'],
	['section-2', 'Section 2'],
	['section-3', 'Section 3'],
	['section-4', 'Section 4'],
	['section-5', 'Section 5'],
	['section-6', 'Section 6'],
	['section-7', 'Section 7'],
	['section-8', 'Section 8'],
	['section-9', 'Section 9'],
	['section-10', 'Section 10'],
	['section-11', 'Section 11']
]);

export const powerCardsMap: Map<string, PowerCard> = new Map([
	[
		"warlord's-domain",
		{
			name: "Warlord's Domain",
			components: { card: WarlordsDomain, ability: WarlordsDomainAbility },
			function: warlordsDomain,
			used: false
		}
	],
	[
		'double-edged-sword',
		{
			name: 'Double-edged Sword',
			components: { card: DoubleEdgedSword, ability: DoubleEdgedSwordAbility },
			function: doubleEdgedSword,
			used: false
		}
	],
	[
		'extra-wind',
		{
			name: 'Extra Wind',
			components: { card: ExtraWind, ability: ExtraWindAbility },
			function: extraWind,
			used: false
		}
	],
	[
		"ancient's-protection",
		{
			name: "Ancient's Protection",
			components: { card: AncientsProtection, ability: AncientsProtectionAbility },
			function: ancientsProtection,
			used: false
		}
	],
	[
		'viral-x-rival',
		{
			name: 'Viral x Rival',
			components: { card: ViralxRival, ability: ViralxRivalAbility },
			function: viralxRival,
			used: false
		}
	],
	[
		'twist-of-fate',
		{
			name: 'Twist of Fate',
			components: { card: TwistOfFate, ability: TwistOfFateAbility },
			function: twistOfFate,
			used: false
		}
	]
]);
