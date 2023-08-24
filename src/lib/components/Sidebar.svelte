<script lang="ts">
	import { page } from '$app/stores';
	import { Github, ThreeDots } from '$lib/assets/icons';
	import { ADMIN_ROUTES, USER_ROUTES } from '$lib/constants';
	import type { UserData } from '$lib/types';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const user = getContext<Writable<UserData>>('user');
	const initials = $user.personal_data.name.first[0] + $user.personal_data.name.last[0];

	const popupProfile: PopupSettings = {
		event: 'click',
		target: 'profile',
		placement: 'top'
	};

	$: isSelectedRoute = (path: string) => {
		const currentPath = $page.url.pathname;

		if (currentPath.length === 1 && path === '/') return true;

		const isSelected = currentPath.startsWith(path) && path !== '/';

		return isSelected;
	};
</script>

<div class="w-64 h-full p-4 justify-between flex flex-col">
	<div class="flex flex-col">
		<a href="/" class="font-gt-walsheim-pro-medium text-2xl md:text-3xl p-4 block">Kali Kalihim</a>
		{#each USER_ROUTES as route, idx (idx)}
			<a href={route.path} type="button">
				<div
					class={`flex items-center gap-2 p-4 ${
						isSelectedRoute(route.path) ? 'text-primary-500' : 'text-white'
					}`}
				>
					<svelte:component this={route.icon} styles="w-6 h-6" />
					<span>{route.name}</span>
				</div>
			</a>
		{/each}

		{#if $user.auth_data.role === 'admin'}
			{#each ADMIN_ROUTES as route, idx (idx)}
				<a href={route.path} type="button">
					<div
						class={`flex items-center gap-2 p-4 ${
							isSelectedRoute(route.path) ? 'text-primary-500' : 'text-white'
						}`}
					>
						<svelte:component this={route.icon} styles="w-6 h-6" />
						<span>{route.name}</span>
					</div>
				</a>
			{/each}
			<!-- <a -->
			<!-- 	class="items-end" -->
			<!-- 	href="https://github.com/xGihyun/kali-kalihim" -->
			<!-- 	target="_blank" -->
			<!-- 	rel="noreferrer" -->
			<!-- 	type="button" -->
			<!-- > -->
			<!-- 	<div class="flex items-center gap-2 p-4 text-white"> -->
			<!-- 		<Github styles="w-6 h-6" /> -->
			<!-- 		<span>Source</span> -->
			<!-- 	</div> -->
			<!-- </a> -->
		{/if}
	</div>

	<div>
		<!-- {#if $user.auth_data.role === 'admin'} -->
		<!-- 	<a -->
		<!-- 		class="items-end" -->
		<!-- 		href="https://github.com/xGihyun/kali-kalihim" -->
		<!-- 		target="_blank" -->
		<!-- 		rel="noreferrer" -->
		<!-- 		type="button" -->
		<!-- 	> -->
		<!-- 		<div class="flex items-center gap-2 p-4 text-white"> -->
		<!-- 			<Github styles="w-6 h-6" /> -->
		<!-- 			<span>Source</span> -->
		<!-- 		</div> -->
		<!-- 	</a> -->
		<!-- {/if} -->

		<button class="p-4 w-full flex items-center justify-between" use:popup={popupProfile}>
			<div class="flex gap-4 items-center">
				<Avatar src={$user.auth_data.photo_url || ''} width="w-10" {initials} />
				<span>{$user.personal_data.name.first}</span>
			</div>
			<ThreeDots styles="w-6 h-6" />
		</button>

		<div
			class="card fixed w-72 py-2 shadow-xl z-[999] transition-none duration-0"
			data-popup="profile"
		>
			<form class="block relative z-[999]" method="post" action="/logout">
				<button class="hover:bg-surface-400-500-token px-2 py-1 w-full" type="submit"
					>Log Out</button
				>
			</form>
			<div class="arrow bg-surface-100-800-token" />
		</div>
	</div>
</div>
