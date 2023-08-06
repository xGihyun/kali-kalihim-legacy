<script lang="ts">
	import { Arnis, Card } from '$lib/components/match/index.js';

	export let data;

	$: ({ matchSets, section } = data);

	type BattleTab = 'arnis' | 'card_battle';

	let matchCategory: BattleTab = 'arnis';
	let matchSetId: string;
</script>

<button
	class={`btn ${matchCategory === 'arnis' ? 'variant-filled' : 'variant-outline'}`}
	on:click={() => (matchCategory = 'arnis')}>Arnis</button
>
<button
	class={`btn ${matchCategory === 'card_battle' ? 'variant-filled' : 'variant-outline'}`}
	on:click={() => (matchCategory = 'card_battle')}>Card Battle</button
>

{#if matchSets}
	<div class="hidden lg:block space-x-2">
		{#each matchSets as matchSet, idx (idx)}
			<a
				href={`/pending-matches/${section}/${matchSet.id}`}
				class={`btn ${matchSetId === matchSet.id ? 'variant-filled' : 'variant-outline'}`}
				on:click={() => {
					matchSetId = matchSet.id;
				}}
			>
				Match {matchSet.data.set}
			</a>
		{/each}
	</div>

	<slot />
	<!-- {#if matchCategory === 'arnis'}
		<Arnis {matchSets} />
	{:else}
		<Card {matchSets} />
	{/if} -->
{:else}
	<div>No matches available</div>
{/if}
