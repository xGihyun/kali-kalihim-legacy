<script lang="ts">
	import { enhance } from '$app/forms';
	import { blockCards, strikeCards } from '$lib/data';
	import { battleCards } from '$lib/store';
	import { json } from '@sveltejs/kit';
	import { StringFormat } from 'firebase/storage';

	function addToQueue(card: string) {
		if ($battleCards.length > 5) return;

		console.log('Pushing ' + card);

		battleCards.update((cards) => [...cards, card]);
	}

	let tempsStrikes = [
		'Leg Strike',
		'Head Strike',
		'Temple Strike',
		'Leg Strike',
		'Shoulder Thrust'
	];
	let tempsBlocks = [
		'Leg Strike Block',
		'Head Strike Block',
		'Temple Strike Block',
		'Shoulder Thrust Block',
		'Shoulder Thrust Block'
	];
</script>

<div>Battle Page</div>

<div class="relative flex h-full w-full flex-col items-center gap-10 px-main py-10">
	<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
		{#each tempsStrikes as strike, idx (idx)}
			<button
				class="bg-surface-400-500-token flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
				on:click={() => addToQueue(strike)}
			>
				<span>{strike}</span>
			</button>
		{/each}
	</div>
	<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
		{#each tempsBlocks as block, idx (idx)}
			<button
				class="bg-surface-400-500-token flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
				on:click={() => addToQueue(block)}
			>
				<span>{block}</span>
			</button>
		{/each}
	</div>
	<div class="fixed bottom-10">
		<!-- <div class="relative">
			<div class="absolute -left-[5%] bottom-0 z-0 h-10 w-[110%] bg-green-500" />
		</div> -->
		{#if $battleCards.length > 0}
			<div class="relative z-10 grid grid-cols-3 place-items-center gap-2 md:grid-cols-6 lg:gap-4">
				{#each $battleCards as card, idx (idx)}
					<button
						class="bg-surface-500-400-token flex aspect-[1/1.3] w-20 flex-col rounded-md lg:w-32 lg:gap-1"
					>
						<span>{card}</span>
					</button>
				{/each}
			</div>
			<form method="post" use:enhance={(e) => {
        e.formData.append('battlecards', JSON.stringify($battleCards));
      }}>
				<button class="btn variant-filled-primary" disabled={$battleCards.length < 6} type="submit">
					Submit
				</button>
			</form>
		{/if}
	</div>
</div>
