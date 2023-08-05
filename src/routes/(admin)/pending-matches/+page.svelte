<script lang="ts">
	import { getMatchSets, getSections } from '$lib/utils/functions';
	import { Arnis, Card } from '$lib/components/match';
	import type { MatchSets } from '$lib/types';
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { afterUpdate, onMount } from 'svelte';

	type BattleTab = 'arnis' | 'card_battle';

	let currentTab: BattleTab = 'arnis';
	let matchSetsResult: Promise<MatchSets[]>;
	let section = 'agatha';

	const sectionPopup: PopupSettings = {
		event: 'click',
		target: 'sections',
		placement: 'bottom'
	};

	onMount(() => {
		matchSetsResult = getMatchSets(section);
	});

	afterUpdate(() => {
		matchSetsResult = getMatchSets(section);
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center py-10">
	<button class="btn variant-filled w-48 justify-between" use:popup={sectionPopup}>
		<span class="capitalize">{section}</span>
		<span>↓</span>
	</button>

	<div class="card w-48 py-2 shadow-xl" data-popup="sections">
		<ul>
			{#await getSections()}
				<span>Loading sections...</span>
			{:then sections}
				{#each sections as [key, value], idx (idx)}
					<li class="flex">
						<button
							class={`flex-1 px-4 py-2 ${
								section === key ? 'variant-filled' : 'bg-surface-100-800-token hover:variant-soft'
							}`}
							on:click={() => (section = key)}>{value}</button
						>
					</li>
				{/each}
			{/await}
		</ul>
		<div class="arrow bg-surface-100-800-token" />
	</div>
	<div class="flex h-full w-full flex-col items-center justify-center">
		<div class="flex gap-4">
			<button
				class={`btn ${currentTab === 'arnis' ? 'variant-filled' : 'variant-outline'}`}
				on:click={() => (currentTab = 'arnis')}>Arnis</button
			>
			<button
				class={`btn ${currentTab === 'card_battle' ? 'variant-filled' : 'variant-outline'}`}
				on:click={() => (currentTab = 'card_battle')}
			>
				Cards
			</button>
		</div>

		<div class="flex h-full w-full flex-col items-center justify-center py-10">
			{#await matchSetsResult}
				<div>Loading match sets...</div>
			{:then matchSets}
				{#if matchSets && matchSets.length > 0}
					<h1 class="mb-5 text-center font-gt-walsheim-pro-medium text-2xl uppercase">
						{section}
					</h1>
					{#if currentTab === 'arnis'}
						<Arnis {matchSets} />
					{:else}
						<Card {matchSets} />
					{/if}
				{:else}
					<div>No matches available</div>
				{/if}
			{/await}
		</div>
	</div>
</div>
