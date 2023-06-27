<script lang="ts">
	import { skills } from '$lib/data';
	import { getContext } from 'svelte';
	import { warlordsDomain } from './functions';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';

	let selectedSkill: string;
	let used = false;

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
	<button
		class="btn variant-filled-primary"
		type="button"
		on:click={() => {
			warlordsDomain($user.auth_data.uid || '', selectedSkill);
			used = true;
		}}
	>
		Submit
	</button>
{:else}
	<p>Successfully used Warlord's Domain</p>
{/if}
