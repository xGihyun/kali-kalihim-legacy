<script lang="ts">
	import { getContext } from 'svelte';
	import { doubleEdgedSword } from './functions';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';
	import { powerCardsMap } from '$lib/data';
	import { selectedPowerCard } from '$lib/store';

	let used = false;

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
	<p>Take the risk?</p>
	<div class="flex justify-end gap-4 pt-4">
		<button class="btn variant-ghost-surface" type="button" on:click={cancelPowerCard}>
			Cancel
		</button>
		<button
			class="btn variant-filled-primary"
			type="button"
			on:click={() => {
				doubleEdgedSword($user.auth_data.uid);
				used = true;
			}}
		>
			Use
		</button>
	</div>
{:else}
	<p>Successfully used Double-edged Sword</p>
{/if}
