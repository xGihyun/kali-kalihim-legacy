<script lang="ts">
	import { powerCardsMap } from '$lib/data';
	import { getContext } from 'svelte';
	import { extraWind } from './functions';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';
	import { selectedPowerCard } from '$lib/store';

	let used = false;
	let newPowerCard: string;

	$: powerCard = powerCardsMap.get($selectedPowerCard || '');

	function cancelPowerCard() {
		if (powerCard) {
			powerCard.used = false;
		}
		$selectedPowerCard = null;
	}

	$: user = getContext<Writable<UserData>>('user');
</script>

{#if !used}
	<div>
		<p>Select a new card:</p>
		<div class="flex max-h-96 flex-wrap items-center justify-center gap-4 overflow-auto p-4">
			{#each powerCardsMap as [key, value], idx (idx)}
				{#if key !== 'extra-wind'}
					<label class="flex cursor-pointer flex-col items-center gap-2">
						<div class="card aspect-[1/1.3] w-40 p-4">
							<svelte:component this={value.components.card} />
						</div>
						<label class="flex items-center gap-2">
							<input
								class="radio"
								type="radio"
								name="powercard"
								value={key}
								bind:group={newPowerCard}
							/>
							<p>
								{value.name}
							</p>
						</label>
					</label>
				{/if}
			{/each}
		</div>

		<div class="flex justify-end gap-4 pt-4">
			<button class="btn variant-ghost-surface" type="button" on:click={cancelPowerCard}>
				Cancel
			</button>
			<button
				class="btn variant-filled-primary"
				type="button"
				on:click={() => {
					extraWind($user.auth_data.uid, newPowerCard);
					used = true;
				}}
			>
				Submit
			</button>
		</div>
	</div>
{:else}
	<p>Successfully used Extra Wind</p>
{/if}
