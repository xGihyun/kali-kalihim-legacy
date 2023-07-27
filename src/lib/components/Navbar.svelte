<script lang="ts">
	import { getContext } from 'svelte';
	import {
		Avatar,
		drawerStore,
		popup,
		type DrawerSettings,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import type { UserData } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { HamburgerMenu } from '$lib/assets/icons';

	const user = getContext<Writable<UserData>>('user');
	const initials = $user.personal_data.name.first[0] + $user.personal_data.name.last[0];

	const popupProfile: PopupSettings = {
		event: 'click',
		target: 'profile',
		placement: 'bottom'
	};

	const settings: DrawerSettings = {
		width: 'w-fit'
	};
</script>

<nav
	class="bg-surface-400-500-token shadow-nav z-50 flex h-20 w-full shrink-0 items-center justify-between gap-5 px-main py-5"
>
	<div class="flex items-center gap-2">
		<button class="block lg:hidden" on:click={() => drawerStore.open(settings)}>
			<HamburgerMenu styles="w-6 h-6" />
		</button>
		<a href="/" class="font-gt-walsheim-pro-medium text-2xl uppercase md:text-4xl">Kali Kalihim</a>
	</div>
	<div class="flex items-center gap-5">
		<div class="flex items-center">
			<button use:popup={popupProfile}>
				<Avatar src={$user.auth_data.photo_url || ''} width="w-10" {initials} />
			</button>
			<div class="card fixed w-72 p-4 shadow-xl transition-none duration-0" data-popup="profile">
				<form class="block" method="post" action="/logout">
					<button class="btn variant-filled-primary w-full">Log Out</button>
				</form>
				<div class="arrow bg-surface-100-800-token" />
			</div>
		</div>
	</div>
</nav>
