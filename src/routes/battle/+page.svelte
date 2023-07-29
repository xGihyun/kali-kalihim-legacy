<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BattleCard, UserData } from '$lib/types';
	import { battle } from '$lib/utils/battlecards';
	import { getContext } from 'svelte';
	import type { PageServerData } from './$types';
	import type { Writable } from 'svelte/store';

	export let data: PageServerData;

	$: user = getContext<Writable<UserData>>('user');
	$: opponent = data.latestOpponent?.auth_data.uid || '';

	$: ({ battleCards } = data);
	$: cardsInQueue = [] as BattleCard[];

	function addToQueue(card: BattleCard) {
		if (cardsInQueue.length > 5) return;

		console.log('Pushing ' + card.name);

		cardsInQueue = [...cardsInQueue, card];
	}
</script>

<div>Battle Page</div>

{#if opponent}
	<button class="btn variant-filled-primary" on:click={() => battle($user.auth_data.uid, opponent)}>
		Sample Battle
	</button>
{/if}

<form method="post" action="?/get_battle_cards" use:enhance>
	<button class="btn variant-filled-primary" type="submit">Get Cards</button>
</form>

<div class="relative flex h-full w-full flex-col items-center gap-10 px-main py-10">
	{#if battleCards}
		{@const strikeCards = battleCards.filter((card) => card.type === 'strike')}
		{@const blockCards = battleCards.filter((card) => card.type === 'block')}

		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
			{#each strikeCards as card, idx (idx)}
				<button
					class="bg-surface-400-500-token flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
					on:click={() => {
						addToQueue(card);
						card.used = true;
					}}
					disabled={card.used}
				>
					<span>{card.name}</span>
				</button>
			{/each}
		</div>

		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
			{#each blockCards as card, idx (idx)}
				<button
					class="bg-surface-400-500-token flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
					on:click={() => {
						addToQueue(card);
						card.used = true;
					}}
				>
					<span>{card.name}</span>
				</button>
			{/each}
		</div>
	{/if}

	{#if cardsInQueue.length > 0}
		<div class="fixed bottom-10">
			<div class="relative z-10 grid grid-cols-3 place-items-center gap-2 md:grid-cols-6 lg:gap-4">
				{#each cardsInQueue as card, idx (idx)}
					<button
						class="bg-surface-500-400-token flex aspect-[1/1.3] w-20 flex-col rounded-md lg:w-32 lg:gap-1"
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
