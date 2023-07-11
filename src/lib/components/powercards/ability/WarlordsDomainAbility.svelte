<script lang="ts">
	import { powerCardsMap, skills } from '$lib/data';
	import { getContext } from 'svelte';
	import { warlordsDomain } from './functions';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';
	import { selectedPowerCard } from '$lib/store';

	let selectedSkill: string;
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
	<label class="label">
		<span>Choose a skill:</span>
		<select class="input" size="1" name="skill" required bind:value={selectedSkill}>
			{#each skills as skill, idx (idx)}
				<span>{skill}</span>
				<option value={skill}>{skill}</option>
			{/each}
		</select>
	</label>
	<div class="flex justify-end gap-4">
		<button
			class="btn variant-ghost-surface"
			type="button"
			on:click={cancelPowerCard}
		>
			Cancel
		</button>
		<button
			class="btn variant-filled-primary"
			type="button"
			on:click={() => {
				warlordsDomain($user.auth_data.uid, selectedSkill);
				used = true;
			}}
		>
			Submit
		</button>
	</div>
{:else}
	<p>Successfully used Warlord's Domain</p>
{/if}
