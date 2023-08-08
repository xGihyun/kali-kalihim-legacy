<script lang="ts">
	import { ActivatePowerCard } from '$lib/components';
	import { db } from '$lib/firebase/firebase';
	import { currentUser, latestOpponent, selectedPowerCard } from '$lib/store';
	import type { Match, UserData } from '$lib/types';
	import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import {
		Banner,
		SelectPowerCards,
		UpcomingMatch,
		UserAvatar,
		Rank,
		PowerCards
	} from '$lib/components/user';
	import { Register, Login } from '$lib/components/auth';
	import { ArnisHistory, CardBattleHistory } from '$lib/components/user/match-history';

	export let data;

	$: pendingMatch = data?.latestPendingMatch?.match;
	$: opponent = data.latestPendingMatch?.opponent;
	$: ({ user, matchHistory, cardBattleHistory, matchSet } = data);

	$: {
		if (user) {
			const userData = user;

			const userRef = doc(db, 'users', userData.auth_data.uid);
			const pendingMatchesCollection = collection(
				db,
				`users/${userData.auth_data.uid}/pending_matches`
			);
			const q = query(pendingMatchesCollection, orderBy('timestamp', 'desc'), limit(1));

			const unsubUser = onSnapshot(userRef, (snapshot) => {
				if (snapshot.exists()) {
					const updatedUserData = snapshot.data() as UserData;

					currentUser.update((val) => ({ ...val, ...updatedUserData }));
				}
			});

			const unsubPendingMatch = onSnapshot(q, (snapshot) => {
				if (!snapshot.empty) {
					const newMatch = snapshot.docs[0]?.data() as Match;
					const newOpponent = newMatch.players.find(
						(player) => player.auth_data.uid !== userData.auth_data.uid
					) as UserData;

					pendingMatch = newMatch;
					latestOpponent.set(newOpponent);
				}
			});

			onDestroy(() => {
				unsubUser();
				unsubPendingMatch();
			});
		}

		if (opponent) {
			const latestOpponentData = opponent;

			const opponentRef = doc(db, 'users', latestOpponentData.auth_data.uid);

			const unsubOpponent = onSnapshot(opponentRef, (snapshot) => {
				if (snapshot.exists()) {
					const updatedOpponentData = snapshot.data() as UserData;

					latestOpponent.update((val) => ({ ...val, ...updatedOpponentData }));
				}
			});

			onDestroy(() => unsubOpponent());
		}
	}
</script>

<!-- TODO: -->
<!-- Make things look better -->
<!-- Improve auth state management -->
<div class="h-full flex flex-col w-full"></div>
<div class="flex h-full w-full flex-col items-center justify-center">
	{#if user.auth_data.is_logged_in && user.auth_data.is_registered}
		<!-- Randomize power cards instead of choosing 3 -->
		{#if user.power_cards.length < 3}
			<SelectPowerCards />
		{:else}
			{@const initials = `${user.personal_data.name.first[0]}${user.personal_data.name.last[0]}`}
			<Banner />
			<UserAvatar {user} {initials} />
			<div class="w-full space-y-6">
				<Rank {user} />
				<div class="flex w-full flex-col gap-6 lg:flex-row lg:px-main">
					<UpcomingMatch {pendingMatch} />
					{#if matchSet}
						{#if matchSet.timer_expired}
							<PowerCards {user} />
						{:else}
							<div
								class="bg-surface-300-600-token border-surface-400-500-token flex w-full flex-col border-token lg:w-1/2 lg:rounded-md"
							>
								<div class="flex justify-center items-center h-full">
									You can't use power cards yet, proceed to Battle page for card battle
								</div>
							</div>
						{/if}
					{/if}
				</div>
				{#if matchHistory && cardBattleHistory}
					<div class="flex w-full flex-col gap-6 lg:flex-row lg:px-main">
						<ArnisHistory history={matchHistory} />
						<CardBattleHistory history={cardBattleHistory} />
					</div>
				{/if}
			</div>

			{#if $selectedPowerCard}
				<ActivatePowerCard />
			{/if}
		{/if}
	{:else if user.auth_data.is_logged_in && !user.auth_data.is_registered}
		<Register />
	{:else if !user.auth_data.is_logged_in && !user.auth_data.is_registered}
		<Login />
	{/if}
</div>
