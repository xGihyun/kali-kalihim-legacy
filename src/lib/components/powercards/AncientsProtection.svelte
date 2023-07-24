<script lang="ts">
	import { getContext } from 'svelte';
	import { ancientsProtection } from './functions';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';

	let used = false;

	$: user = getContext<Writable<UserData>>('user');
</script>

{#if !used}
	<p>Receive protection?</p>
	<button
		class="btn variant-filled-primary"
		type="button"
		on:click={() => {
			ancientsProtection($user.auth_data.uid);
			used = true;
		}}
	>
		Use
	</button>
{:else}
	<p>Successfully used Ancient's Protection</p>
{/if}
