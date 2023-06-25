<script lang="ts">
	import { page } from '$app/stores';
	import { sectionMap } from '$lib/data.js';
	import { db } from '$lib/firebase/firebase.js';
	import type { MatchSet } from '$lib/types.js';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { collection, onSnapshot, query, where } from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	export let data;

	let matchSets = data.matchSets;

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

	onDestroy(() => unsubMatchSets());
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#if matchSets.length > 0}
		<h1 class="font-gt-walsheim-pro-medium mb-5 text-center text-2xl uppercase">
			{sectionMap.get(data.section)}
		</h1>
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
		<div class="flex h-full w-full flex-col items-center justify-center">
			<slot />
		</div>
	{:else}
		<div>No matches available</div>
	{/if}
</div>
