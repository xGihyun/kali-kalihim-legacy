<script lang="ts">
	import { page } from '$app/stores';
	import { db } from '$lib/firebase/firebase';
	import type { MatchSet } from '$lib/types';
	import { TabGroup, TabAnchor, type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { collection, onSnapshot, query, where } from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	export let data;

	$: ({ matchSets, section } = data);

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', data.section));
	const unsubMatchSets = onSnapshot(matchQuery, async (snapshot) => {
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

	$: match = 'Match';

	const matchPopup: PopupSettings = {
		event: 'click',
		target: 'matches',
		placement: 'bottom'
	};

	onDestroy(() => unsubMatchSets());
</script>

<div class="flex h-full w-full flex-col items-center justify-center py-10">
	{#if matchSets.length > 0}
		<h1 class="mb-5 text-center font-gt-walsheim-pro-medium text-2xl uppercase">
			{section}
		</h1>
		<div class="hidden lg:block">
			<TabGroup justify="justify-center">
				{#each matchSets as matchSet, idx (idx)}
					<TabAnchor
						href={`/pending-matches/${data.section}/${matchSet.id}`}
						selected={$page.url.pathname === `/pending-matches/${data.section}/${matchSet.id}`}
					>
						Match {matchSet.data.set}
					</TabAnchor>
				{/each}
			</TabGroup>
		</div>

		<button class="btn flex variant-filled w-48 justify-between lg:hidden" use:popup={matchPopup}>
			<span class="capitalize">{match}</span>
			<span>↓</span>
		</button>
		<div class="card w-48 py-2 shadow-xl" data-popup="matches">
			<ul>
				{#each matchSets as matchSet, idx (idx)}
					<li class="flex">
						<a
							class={`flex-1 px-4 py-2 ${
								match === `Match ${matchSet.data.set}`
									? 'variant-filled'
									: 'bg-surface-100-800-token hover:variant-soft'
							}`}
							href={`/pending-matches/${data.section}/${matchSet.id}`}
							on:click={() => (match = `Match ${matchSet.data.set}`)}
						>
							Match {matchSet.data.set}
						</a>
					</li>
				{/each}
			</ul>
			<div class="arrow bg-surface-100-800-token" />
		</div>

		<div class="flex h-full w-full flex-col items-center justify-center">
			<slot />
		</div>
	{:else}
		<div>No matches available</div>
	{/if}
</div>
