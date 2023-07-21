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
	// import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
	// import { db } from '$lib/firebase/firebase';
	// import { onDestroy } from 'svelte';
	// import { Bell } from '../assets/icons';

	// export let notifications: PendingMatch[];

	const user = getContext<Writable<UserData>>('user');
	const initials = $user.personal_data.name.first[0] + $user.personal_data.name.last[0];

	// const popupNotification: PopupSettings = {
	// 	event: 'click',
	// 	target: 'notifications',
	// 	placement: 'bottom'
	// };

	const popupProfile: PopupSettings = {
		event: 'click',
		target: 'profile',
		placement: 'bottom'
	};

	// function timestampToDate(timestamp: Timestamp): Date {
	// 	return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
	// }

	// function getTimeSince(date: Date): string {
	// 	const currentTime = new Date();
	// 	const timeDifference = Math.floor((currentTime.getTime() - date.getTime()) / 1000);

	// 	if (timeDifference < 60) {
	// 		return `${timeDifference} seconds ago`;
	// 	} else if (timeDifference < 3600) {
	// 		const minutes = Math.floor(timeDifference / 60);
	// 		return `${minutes} minutes ago`;
	// 	} else if (timeDifference < 86400) {
	// 		const hours = Math.floor(timeDifference / 3600);
	// 		return `${hours} hours ago`;
	// 	} else {
	// 		const days = Math.floor(timeDifference / 86400);
	// 		return `${days} days ago`;
	// 	}
	// }

	// if ($user.auth_data.uid) {
	// 	const pendingMatchesCollection = collection(db, `users/${$user.auth_data.uid}/pending_matches`);
	// 	const q = query(pendingMatchesCollection, orderBy('timestamp.seconds', 'desc'));
	// 	const unsubNotifications = onSnapshot(q, (snapshot) => {
	// 		notifications = snapshot.docs.map(
	// 			(match) => JSON.parse(JSON.stringify(match.data())) as PendingMatch
	// 		);
	// 	});

	// 	onDestroy(() => unsubNotifications());
	// }
	const settings: DrawerSettings = {
		width: 'w-fit'
	};
</script>

<nav
	class="bg-surface-300-600-token shadow-nav z-50 flex h-20 w-full shrink-0 items-center justify-between gap-5 px-main py-5"
>
	<div class="flex items-center gap-2">
		<button class="block lg:hidden" on:click={() => drawerStore.open(settings)}>
			<HamburgerMenu styles="w-6 h-6" />
		</button>
		<a href="/" class="font-gt-walsheim-pro-medium text-2xl uppercase md:text-4xl">Kali Kalihim</a>
	</div>
	<div class="flex items-center gap-5">
		<!-- <div class="flex items-center">
				<button class="btn-icon w-10 aspect-square variant-filled" use:popup={popupNotification}>
					<Bell styles="w-5 h-5" />
				</button>
				<div class="fixed card p-4 w-72 shadow-xl transition-none duration-0" data-popup="notifications">
					{#if notifications.length > 0}
						<ul class="space-y-4 max-h-[75vh] overflow-auto">
							{#each notifications as notification, idx (idx)}
								<li class="flex flex-col items-start">
									{#each notification.players as player, playerIdx (playerIdx)}
										{#if player.auth_data.uid !== $user.auth_data.uid}
											<p>
												Match VS
												<span class="font-bold text-sm md:text-base"
													>{player.personal_data.name.first} {player.personal_data.name.last}</span
												>
											</p>
										{/if}
									{/each}
									<span class="text-sm opacity-50"
										>{getTimeSince(timestampToDate(notification.timestamp))}</span
									>
								</li>
							{/each}
						</ul>
					{:else}
						<span class="opacity-50 justify-center w-full flex">No matches</span>
					{/if}
					<div class="arrow bg-surface-100-800-token" />
				</div>
			</div> -->

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
