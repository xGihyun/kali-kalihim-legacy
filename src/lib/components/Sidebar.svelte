<script lang="ts">
	import { page } from '$app/stores';
	import { Github } from '$lib/assets/icons';
	import { ADMIN_ROUTES, USER_ROUTES } from '$lib/constants';
	import type { UserData } from '$lib/types';
	import { AppRail, AppRailAnchor, drawerStore } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	$: user = getContext<Writable<UserData>>('user');
</script>

<AppRail border="border-r border-surface-400-500-token" background="bg-surface-200-700-token">
	{#each USER_ROUTES as route, idx (idx)}
		<AppRailAnchor
			href={route.path}
			selected={$page.url.pathname.startsWith(route.path)}
			on:click={() => drawerStore.close()}
		>
			<svelte:fragment slot="lead">
				<svelte:component this={route.icon} styles="w-6 h-6" />
			</svelte:fragment>
			<span>{route.name}</span>
		</AppRailAnchor>
	{/each}

	{#if $user.auth_data.role === 'admin'}
		{#each ADMIN_ROUTES as route, idx (idx)}
			<AppRailAnchor href={route.path} selected={$page.url.pathname.startsWith(route.path)}>
				<svelte:fragment slot="lead">
					<svelte:component this={route.icon} styles="w-6 h-6" />
				</svelte:fragment>
				<span>{route.name}</span>
			</AppRailAnchor>
		{/each}
	{/if}

	<svelte:fragment slot="trail">
		{#if $user.auth_data.role === 'admin'}
			<AppRailAnchor href="https://github.com/xGihyun/kali-kalihim" target="_blank" title="Source">
				<svelte:fragment slot="lead">
					<Github styles="w-6 h-6" />
				</svelte:fragment>
			</AppRailAnchor>
		{/if}
	</svelte:fragment>
</AppRail>
