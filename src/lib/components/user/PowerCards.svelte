<script lang="ts">
	import { Cards } from '$lib/assets/icons';
	import { powerCardsMap } from '$lib/data';
	import { selectedPowerCard } from '$lib/store';
	import type { UserData } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let user: UserData;

	$: currentUser = getContext<Writable<UserData>>('user');
</script>

{#if !user.is_private || user.auth_data.uid === $currentUser.auth_data.uid}
	<div
		class="flex w-full lg:w-1/2 flex-col lg:rounded-md bg-surface-200-700-token border-surface-400-500-token border-token"
	>
		<div class="flex h-20 w-full items-center gap-4 px-main">
			<Cards styles="w-8 h-8" />
			<span class="w-full text-2xl uppercase">power cards</span>
		</div>
		<!-- Power cards the user has -->
		<div
			class="grid h-full grid-cols-3 place-items-center gap-2 px-main py-4 lg:gap-10 lg:px-[10%]"
		>
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
{:else}
	<div class="block w-full text-center opacity-50">This account is private</div>
{/if}
