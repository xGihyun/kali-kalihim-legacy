<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BattleCard } from '$lib/types';
	import { blockCards, strikeCards } from '$lib/data';

	$: cardsInQueue = [] as BattleCard[];
	$: selected = [] as string[];

	function addToQueue(card: BattleCard) {
		if (cardsInQueue.length > 5) return;

		console.log('Adding: ' + card.name);

		cardsInQueue = [...cardsInQueue, card];
		selected = [...selected, card.name];

		console.log(selected);
	}

	function removeInQueue(index: number, card: string) {
		console.log('Removing');

		cardsInQueue = cardsInQueue.filter((_, i) => i !== index);
		selected = selected.filter((name) => name !== card);
	}
</script>

<div class="relative flex h-full w-full flex-col items-center gap-10 px-main py-10">
	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Strikes</h2>
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
			{#each strikeCards as [_, value], idx (idx)}
				<button
					class="bg-surface-400-500-token flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
					on:click={(e) => {
						addToQueue({ name: value.name, skill: 'strike' });
					}}
					disabled={selected.includes(value.name)}
				>
					<span>{value.name}</span>
				</button>
			{/each}
		</div>
	</div>
	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Blocks</h2>
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
			{#each blockCards as [_, value], idx (idx)}
				<button
					class="bg-surface-400-500-token flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
					on:click={(e) => {
						addToQueue({ name: value.name, skill: 'block' });
					}}
					disabled={selected.includes(value.name)}
				>
					<span>{value.name}</span>
				</button>
			{/each}
		</div>
	</div>

	{#if cardsInQueue.length > 0}
		<div class="fixed bottom-10">
			<div class="relative z-10 grid grid-cols-3 place-items-center gap-2 md:grid-cols-6 lg:gap-4">
				{#each cardsInQueue as card, idx (idx)}
					<button
						class="bg-surface-500-400-token flex aspect-[1/1.3] w-20 flex-col rounded-md lg:w-32 lg:gap-1"
						on:click={() => removeInQueue(idx, card.name)}
					>
						<span>{card.name}</span>
					</button>
				{/each}
			</div>
			<form
				method="post"
				action="?/battle"
				use:enhance={(e) => {
					e.formData.append('battle_cards', JSON.stringify(cardsInQueue));
				}}
			>
				<button class="btn variant-filled-primary" disabled={cardsInQueue.length < 6} type="submit">
					Submit
				</button>
			</form>
		</div>
	{/if}
</div>
