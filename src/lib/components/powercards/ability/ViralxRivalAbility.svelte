<script lang="ts">
	import { getContext } from 'svelte';
	import { viralxRival } from './functions';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';

	let used = false;

	$: user = getContext<Writable<UserData>>('user');
	$: opponent = getContext<Writable<UserData>>('opponent');
</script>

{#if !used}
	<p>
		Do you want to have another match with
		<span class="font-bold">
			{$opponent.personal_data.name.first}
			{$opponent.personal_data.name.last}
		</span>
		?
	</p>
	<button
		class="btn variant-filled-primary"
		type="button"
		on:click={() => {
			viralxRival($user.auth_data.uid);
			used = true;
		}}
	>
		Use
	</button>
{:else}
	<p>Successfully used Viral x Rival</p>
{/if}
