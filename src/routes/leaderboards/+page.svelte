<script lang="ts">
	import type { UserData } from '$lib/types.js';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;

	let users = data.users;

	$: currentUser = getContext<Writable<UserData>>('user');
</script>

<div class="flex h-full flex-col items-center justify-center">
	<!-- <div class="max-w-xl w-full">
		{#each users as user, idx (idx)}
			<div class="flex gap-4 w-full justify-between">
				<p>{user.personal_data.name.first} {user.personal_data.name.last}</p>
				<span>{user.score}</span>
			</div>
		{/each}
	</div> -->
	<ol class="list">
		{#each users as user, idx (idx)}
			<li class={`${user.auth_data.uid === $currentUser.auth_data.uid ? 'font-extrabold text-yellow-200' : 'font-normal'}`}>
				<span>{idx + 1}.</span>
				<span class="flex-auto">{user.personal_data.name.first} {user.personal_data.name.last}</span
				>
				<span>{user.score}</span>
			</li>
		{/each}
	</ol>
</div>
