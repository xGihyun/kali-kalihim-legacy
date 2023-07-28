<script lang="ts">
	import { Cards } from '$lib/assets/icons';
	import { selectedPowerCard } from '$lib/store';
	import type { UserData } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { PowerCard } from '../powercards';

	export let user: UserData;

	$: currentUser = getContext<Writable<UserData>>('user');

	function isCurrentUser() {
		return user.auth_data.uid === $currentUser.auth_data.uid;
	}

	function isUsed(used: boolean) {
		return used && isCurrentUser();
	}

	function isActivated(activated: boolean, used: boolean) {
		return activated && !used && isCurrentUser();
	}
</script>

{#if !user.is_private || user.auth_data.uid === $currentUser.auth_data.uid}
	<div
		class="bg-surface-300-600-token border-surface-400-500-token flex w-full flex-col border-token lg:w-1/2 lg:rounded-md"
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
					class={`w-full max-w-[15rem] rounded-container-token ${!isCurrentUser() ? 'pointer-events-none' : 'pointer-events-auto'} ${
						isUsed(card.used) ? 'opacity-50' : 'opacity-100'
					} ${
						isActivated(card.activated, card.used) ? 'border-4 border-green-500' : 'border-none'
					}`}
					on:click={() => {
						if (!isCurrentUser()) return;

						selectedPowerCard.set(card.key);
					}}
					disabled={isCurrentUser() &&
						(isUsed(card.used) || isActivated(card.activated, card.used))}
				>
					<PowerCard key={card.key} />
				</button>
			{/each}
		</div>
	</div>
{:else}
	<div class="block w-full text-center opacity-50">This account is private</div>
{/if}
