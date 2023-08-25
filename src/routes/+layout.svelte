<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { allUsersInSection, currentUser, latestOpponent, section } from '$lib/store';
	import { getContext, setContext } from 'svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Navbar, Sidebar } from '$lib/components';
	import type { UserData } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { Drawer } from '@skeletonlabs/skeleton';

	export let data;

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	$: if (data.user) {
		currentUser.set({
			auth_data: {
				email: data.user.auth_data.email,
				is_logged_in: data.user.auth_data.is_logged_in,
				is_registered: data.user.auth_data.is_registered,
				photo_url: data.user.auth_data.photo_url,
				uid: data.user.auth_data.uid,
				username: data.user.auth_data.username,
				role: data.user.auth_data.role
			},
			personal_data: {
				age: data.user.personal_data.age,
				contact_number: data.user.personal_data.contact_number,
				name: {
					first: data.user.personal_data.name.first,
					last: data.user.personal_data.name.last
				},
				section: data.user.personal_data.section,
				sex: data.user.personal_data.sex
			},
			score: data.user.score,
			rank: {
				number: {
					overall: data.user.rank.number.overall,
					section: data.user.rank.number.section
				},
				title: data.user.rank.title
			},
			power_cards: data.user.power_cards,
			is_private: false
		});
	}

	setContext('user', currentUser);
	setContext('opponent', latestOpponent);
	setContext('usersInSection', allUsersInSection);
	setContext('section', section);

	const user = getContext<Writable<UserData>>('user');
</script>

<div
	class="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-bl from-surface-500 to-surface-800"
>
	{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
		<Navbar />
	{/if}

	<Drawer zIndex="z-[51]">
		<Sidebar />
	</Drawer>

	<div class="flex h-full w-full flex-auto overflow-hidden">
		{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
			<aside class="hidden lg:block">
				<Sidebar />
			</aside>
		{/if}

		<main class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden lg:m-4 lg:rounded-lg">
			<div class="flex-1 bg-surface-900 lg:py-10 lg:px-main">
				<slot />
			</div>
		</main>
	</div>
</div>
