<script lang="ts">
	import { getContext } from 'svelte';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { PendingMatches, UserData } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { onDestroy } from 'svelte';
	import { Bell } from '../assets/icons';

	export let notifications: PendingMatches[];

	const user = getContext<Writable<UserData>>('user');
	const initials = $user.personal_data.name.first[0] + $user.personal_data.name.last[0];

	const popupNotification: PopupSettings = {
		event: 'click',
		target: 'notifications',
		placement: 'bottom'
	};

	const popupProfile: PopupSettings = {
		event: 'click',
		target: 'profile',
		placement: 'bottom'
	};

	function timestampToDate(timestamp: Timestamp): Date {
		return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
	}

	function getTimeSince(date: Date): string {
		const currentTime = new Date();
		const timeDifference = Math.floor((currentTime.getTime() - date.getTime()) / 1000);

		if (timeDifference < 60) {
			return `${timeDifference} seconds ago`;
		} else if (timeDifference < 3600) {
			const minutes = Math.floor(timeDifference / 60);
			return `${minutes} minutes ago`;
		} else if (timeDifference < 86400) {
			const hours = Math.floor(timeDifference / 3600);
			return `${hours} hours ago`;
		} else {
			const days = Math.floor(timeDifference / 86400);
			return `${days} days ago`;
		}
	}

	if ($user.auth_data.uid) {
		const pendingMatchesCollection = collection(db, `users/${$user.auth_data.uid}/pending_matches`);
		const q = query(pendingMatchesCollection, orderBy('timestamp', 'desc'));
		const unsubNotifications = onSnapshot(q, (snapshot) => {
			notifications = snapshot.docs.map(
				(match) => JSON.parse(JSON.stringify(match.data())) as PendingMatches
			);
		});

		onDestroy(() => unsubNotifications());
	}
</script>

{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
	<nav
		class="flex fixed h-20 w-full shrink-0 items-center justify-between gap-5 border-b-[1px] border-neutral-800 px-[5%] py-5"
	>
		<a href="/" class="font-gt-walsheim-pro-medium text-2xl md:text-4xl uppercase">Kali Kalihim</a>
		<div class="flex items-center gap-5">
			<a class="variant-filled-secondary btn hidden md:block" type="button" href="/leaderboards"
				>Leaderboards</a
			>
			<a class="variant-filled-secondary btn hidden md:block" type="button" href="/matchmake"
				>Matchmake</a
			>
			<div class="flex items-center">
				<button class="btn-icon w-10 aspect-square variant-filled" use:popup={popupNotification}>
					<Bell styles="w-5 h-5" />
				</button>
				<div class="card p-4 w-72 shadow-xl transition-none duration-0" data-popup="notifications">
					<ul class="space-y-4 max-h-[75vh] overflow-auto">
						{#each notifications as notification, idx (idx)}
							<li class="flex flex-col items-start">
								{#each notification.players as player, playerIdx (playerIdx)}
									{#if player.auth_data.uid !== $user.auth_data.uid}
										<p>
											Match VS
											<span class="font-bold"
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
					<div class="arrow bg-surface-100-800-token" />
				</div>
			</div>
			
			<div class="flex items-center">
				<button use:popup={popupProfile}>
					<Avatar src={$user.auth_data.photo_url || ''} width="w-10" {initials} />
				</button>
				<div class="card p-4 w-72 shadow-xl transition-none duration-0" data-popup="profile">
					<ul class="space-y-4">
						<a class="variant-filled-surface btn block md:hidden" type="button" href="/leaderboards"
							>Leaderboards</a
						>
						<a class="variant-filled-surface btn block md:hidden" type="button" href="/matchmake"
							>Matchmake</a
						>
						<form class="block" method="post" action="/logout">
							<button class="btn w-full variant-filled-primary">Log Out</button>
						</form>
					</ul>
					<div class="arrow bg-surface-100-800-token" />
				</div>
			</div>
		</div>
	</nav>
{/if}
