<script lang="ts">
	import { powerCardsMap } from '$lib/data';
	import { selectedPowerCard } from '$lib/store';
	import type { UserData } from '$lib/types';

	export let user: UserData;
</script>

{#if !user.is_private}
	<div class="flex w-full flex-col">
		<div class="flex h-20 w-full items-center px-[5%] bg-surface-100-800-token">
			<span class="w-full text-center text-2xl uppercase">power cards</span>
		</div>
		<!-- Power cards the user has -->
		<div class="grid grid-cols-3 place-items-center gap-2 px-[5%] py-10 lg:gap-10 lg:px-[10%]">
			{#each user.power_cards as card, idx (idx)}
				<button
					class={`w-full max-w-[15rem] rounded-container-token ${
						card.used ? 'opacity-50' : 'opacity-100'
					} ${card.activated && !card.used ? 'border-4 border-green-500' : 'border-none'}`}
					on:click={() => {
						selectedPowerCard.set(card.key);
					}}
					disabled={card.used || card.activated}
				>
					<svelte:component this={powerCardsMap.get(card.key)?.components.card} />
				</button>
			{/each}
		</div>
	</div>
{/if}
