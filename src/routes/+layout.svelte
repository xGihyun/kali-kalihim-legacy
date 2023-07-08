<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { allUsersInSection, currentUser, latestOpponent } from '$lib/store';
	import { getContext, onMount, setContext } from 'svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Navbar } from '$lib/components';
	import init from '$lib/pkg/my_package';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import { ADMIN_ROUTES } from '$lib/constants';
	import { page } from '$app/stores';
	import { Github } from '$lib/assets/icons';
	import type { UserData } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let data;

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	$: currentUser.set({
		auth_data: {
			email: data.user?.auth_data.email || '',
			is_logged_in: data.user?.auth_data.is_logged_in || false,
			is_registered: data.user?.auth_data.is_registered || false,
			photo_url: data.user?.auth_data.photo_url || '',
			uid: data.user?.auth_data.uid || '',
			username: data.user?.auth_data.username || '',
			role: data.user?.auth_data.role || ''
		},
		personal_data: {
			age: data.user?.personal_data.age || 0,
			contact_number: data.user?.personal_data.contact_number || 0,
			name: {
				first: data.user?.personal_data.name.first || '',
				last: data.user?.personal_data.name.last || ''
			},
			section: data.user?.personal_data.section || '',
			sex: data.user?.personal_data.sex || ''
		},
		score: data.user?.score || 0,
		rank: {
			number: {
				overall: data.user?.rank.number.overall || 0,
				section: data.user?.rank.number.section || 0
			},
			title: data.user?.rank.title || ''
		},
		power_cards: data.user?.power_cards || []
	});

	setContext('user', currentUser);
	setContext('opponent', latestOpponent);
	setContext('usersInSection', allUsersInSection);

	const user = getContext<Writable<UserData>>('user');

	onMount(async () => {
		await init();
	});
</script>

<div class="flex h-screen w-full flex-col overflow-hidden">
	{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
		<Navbar />
	{/if}
	<div class="flex h-full w-full flex-auto overflow-hidden">
		{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
			<AppRail border="border-r border-surface-500/75" background="bg-surface-50-900-token">
				{#each ADMIN_ROUTES as route, idx (idx)}
					<AppRailAnchor href={route.path} selected={$page.url.pathname === route.path}>
						<svelte:fragment slot="lead">
							<svelte:component this={route.icon} styles="w-6 h-6" />
						</svelte:fragment>
						<span>{route.name}</span>
					</AppRailAnchor>
				{/each}
				<svelte:fragment slot="trail">
					<AppRailAnchor
						href="https://github.com/xGihyun/kali-kalihim"
						target="_blank"
						title="Source"
					>
						<svelte:fragment slot="lead">
							<Github styles="w-6 h-6" />
						</svelte:fragment>
					</AppRailAnchor>
				</svelte:fragment>
			</AppRail>
		{/if}

		<main class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
			<div class="flex flex-1 flex-col items-center justify-center">
				<slot />
			</div>
		</main>
	</div>
</div>
