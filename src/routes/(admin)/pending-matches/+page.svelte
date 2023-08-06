<script lang="ts">
	import { getMatchSets, getSections } from '$lib/utils/functions';
	import { Arnis, Card } from '$lib/components/match';
	import type { MatchSets, Section } from '$lib/types';
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { afterUpdate, onMount } from 'svelte';

	// export let data;

	// $: ({ sections } = data);
	let sections: Section[] = [];

	type BattleTab = 'arnis' | 'card_battle';

	let matchSetsResult: Promise<MatchSets[]>;
	let matchCategory: BattleTab = 'arnis';
	let selectedSection = 'agatha';
	let matchCategories: BattleTab[] = ['arnis', 'card_battle'];

	const sectionPopup: PopupSettings = {
		event: 'click',
		target: 'sections',
		placement: 'bottom'
	};
	const matchSetPopup: PopupSettings = {
		event: 'click',
		target: 'match_set',
		placement: 'bottom'
	};
	const matchCategoryPopup: PopupSettings = {
		event: 'click',
		target: 'match_category',
		placement: 'bottom'
	};

	async function test() {
		const response = await fetch('/api/section', { method: 'GET' });
		const result = await response.json();

		console.log(result);

		sections = result as Section[];
	}

	onMount(() => {
		matchSetsResult = getMatchSets(selectedSection);

		test();
	});

	afterUpdate(() => {
		matchSetsResult = getMatchSets(selectedSection);
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center py-10">
	<div class="flex gap-4 w-full max-w-5xl relative">
		<button class="btn variant-filled w-full justify-between" use:popup={sectionPopup}>
			<span class="capitalize">{selectedSection}</span>
			<span>↓</span>
		</button>

		<!-- {#if sections && sections.length > 0} -->
		<div class="card w-3/4 max-w-5xl py-2 shadow-xl" data-popup="sections">
			<ul>
				<!-- {#await getSections()}
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
				{/await} -->
				{#each sections as section, idx (idx)}
					<li class="flex">
						<button
							class={`flex-1 px-4 py-2 ${
								selectedSection === section.id
									? 'variant-filled'
									: 'bg-surface-100-800-token hover:variant-soft'
							}`}
							on:click={() => (selectedSection = section.id)}>{section.name}</button
						>
					</li>
				{/each}
			</ul>
			<div class="arrow bg-surface-100-800-token" />
		</div>
		<!-- {/if} -->
		<button class="btn variant-filled w-1/4 justify-between" use:popup={matchCategoryPopup}>
			<span class="capitalize">{matchCategory}</span>
			<span>↓</span>
		</button>

		<!-- <button class="btn variant-filled w-1/4 justify-between" use:popup={matchSetPopup}>
			<span class="capitalize">{matchset}</span>
			<span>↓</span>
		</button> -->
	</div>

	<div class="card w-48 py-2 shadow-xl" data-popup="match_category">
		<ul>
			{#each matchCategories as category (category)}
				<li class="flex">
					<button
						class={`flex-1 px-4 py-2 ${
							matchCategory === category
								? 'variant-filled'
								: 'bg-surface-100-800-token hover:variant-soft'
						}`}
						on:click={() => (matchCategory = category)}>{category}</button
					>
				</li>
			{/each}
		</ul>
		<div class="arrow bg-surface-100-800-token" />
	</div>

	<div class="flex h-full w-full flex-col items-center justify-center">
		<div class="flex h-full w-full flex-col items-center justify-center py-10 gap-5">
			{#await matchSetsResult}
				<div>Loading match sets...</div>
			{:then matchSets}
				{#if matchSets && matchSets.length > 0}
					<!-- <h1 class="mb-5 text-center font-gt-walsheim-pro-medium text-2xl uppercase">
						{section}
					</h1> -->
					{#if matchCategory === 'arnis'}
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
