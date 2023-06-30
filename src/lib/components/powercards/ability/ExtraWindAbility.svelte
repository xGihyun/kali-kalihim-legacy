<script lang="ts">
	import { powerCardsMap } from '$lib/data';
	import { getContext } from 'svelte';
	import { extraWind } from './functions';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';

	let used = false;
	let selectedPowerCard: string;

	$: user = getContext<Writable<UserData>>('user');
</script>

{#if !used}
	<div>
		<p>Select a new card:</p>
		<div class="flex flex-wrap items-center justify-center gap-4">
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
								bind:group={selectedPowerCard}
							/>
							<p>
								{value.name}
							</p>
						</label>
					</label>
				{/if}
			{/each}
		</div>

		<button
			class="btn variant-filled-primary"
			type="button"
			on:click={() => {
				extraWind($user.auth_data.uid, selectedPowerCard);
				used = true;
			}}
		>
			Submit
		</button>
	</div>
{:else}
	<p>Successfully used Extra Wind</p>
{/if}
