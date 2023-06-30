<script lang="ts">
	import { getContext } from 'svelte';
	import { doubleEdgedSword } from './functions';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';

	let used = false;

	$: user = getContext<Writable<UserData>>('user');
</script>

{#if !used}
	<p>Take the risk?</p>
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
{:else}
	<p>Successfully used Double-edged Sword</p>
{/if}
