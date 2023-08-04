<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { CircleCheckFilled, ClockPause } from '$lib/assets/icons/index.js';
	import { Arnis, Card } from '$lib/components/match';
	import { db } from '$lib/firebase/firebase';
	import type { CardBattle, Match, MatchSet, UserData } from '$lib/types';
	import { getCardBattle, getMatch } from '$lib/utils/functions.js';
	import { TabGroup, TabAnchor, type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
	import { afterUpdate, onDestroy, onMount } from 'svelte';

	export let data;

	$: ({ matchSets, section } = data);

	type BattleTab = 'arnis' | 'card_battle';

	let currentTab: BattleTab = 'arnis';
	// let clickedRow: number | null = null;

	// function toggleRow(idx: number) {
	// 	clickedRow = clickedRow === idx ? null : idx;
	// }

	let matchesResult: Promise<Match[]> | undefined;
	let matchSetId: string;
	let cardBattleResult: Promise<CardBattle[]> | undefined;

	onMount(() => {
		if (matchSets) {
			matchSetId = matchSets[0].id;
			matchesResult = getMatch(matchSetId);
			cardBattleResult = getCardBattle(matchSetId);
		}
	});

	afterUpdate(() => {
		if (matchSets) {
			matchSetId = matchSets[0].id;
			matchesResult = getMatch(matchSetId);
			cardBattleResult = getCardBattle(matchSetId);
		}
	});

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', data.section));
	const unsubMatchSets = onSnapshot(matchQuery, (snapshot) => {
		matchSets = snapshot.docs
			.map((matchSet) => {
				const matchSetId = matchSet.id;
				const matchSetData = matchSet.data() as MatchSet;

				return {
					id: matchSetId,
					data: matchSetData
				};
			})
			.sort((a, b) => a.data.set - b.data.set);

		console.log('Updated match sets.');
	});

	// onDestroy(() => unsubMatchSets());
</script>

<div class="flex gap-4">
	<button class="btn variant-filled" on:click={() => (currentTab = 'arnis')}>Arnis</button>
	<button class="btn variant-filled" on:click={() => (currentTab = 'card_battle')}>Cards</button>
</div>

<div>{section}</div>
<div class="flex h-full w-full flex-col items-center justify-center py-10">
	{#if matchSets && matchSets.length > 0}
		{#if currentTab === 'arnis'}
			<Arnis {matchesResult} {matchSets} {matchSetId} {section} />
		{:else}
			<Card {cardBattleResult} {matchSets} {matchSetId} />
		{/if}
	{:else}
		<div>No matches available</div>
	{/if}
</div>
