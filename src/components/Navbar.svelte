<script lang="ts">
	import { getContext } from 'svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { UserData } from '$lib/types';
	import type { Writable } from 'svelte/store';

	const user = getContext<Writable<UserData>>('user');
	const initials = $user.personal_data.name.first[0] + $user.personal_data.name.last[0];
</script>

{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
	<nav
		class="flex fixed h-20 w-full shrink-0 items-center justify-between gap-5 border-b-[1px] border-neutral-800 px-20 py-5"
	>
		<a href="/" class="font-gt-walsheim-pro-medium text-4xl uppercase">Kali Kalihim</a>
		<div class="flex gap-5">
			<a class="variant-filled-secondary rounded-md p-2" type="button" href="/leaderboards"
				>Leaderboards</a
			>
			<a class="variant-filled-secondary rounded-md p-2" type="button" href="/matchmake"
				>Matchmake</a
			>
			<form method="post" action="/logout">
				<button class="variant-filled-primary rounded-md p-2">Log Out</button>
			</form>
			<!-- <a href="/profile">
				<Avatar src={$user.auth_data.photo_url || ''} width="w-10" />
			</a> -->
			<Avatar src={$user.auth_data.photo_url || ''} width="w-10" {initials} />
		</div>
	</nav>
{/if}
