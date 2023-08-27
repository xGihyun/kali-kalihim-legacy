<script lang="ts">
	import { ActivatePowerCard } from '$lib/components';
	import { db } from '$lib/firebase/firebase';
	import { currentUser, latestOpponent, selectedPowerCard } from '$lib/store';
	import type { Match, MatchSet, UserData } from '$lib/types';
	import { collection, doc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { Banner, UpcomingMatch, UserAvatar, Rank, PowerCards } from '$lib/components/user';
	import { Login } from '$lib/components/auth';
	import { ArnisHistory, CardBattleHistory } from '$lib/components/user/match-history';
	import type { Writable } from 'svelte/store';
	import type { Unsubscribe } from 'firebase/auth';

	export let data;

	const currentUserCtx = getContext<Writable<UserData>>('user');

	$: pendingMatch = data.latestPendingMatch?.match;
	$: opponent = data.latestPendingMatch?.opponent;
	$: ({ user, matchHistory, cardBattleHistory, matchSet, matchSetId, sections } = data);

	$: if (opponent) {
		latestOpponent.set(opponent);
	}

	let unsubPendingMatch: Unsubscribe;
	let unsubUser: Unsubscribe;
	let unsubLatestMatchSet: Unsubscribe;
	let unsubOpponent: Unsubscribe;
	let unsubTimer: Unsubscribe;

	onMount(() => {
		console.log('Mounting...');
		// console.log(pendingMatch);

		if (user) {
			const userRef = doc(db, 'users', user.auth_data.uid);
			const pendingMatchesCollection = collection(
				db,
				`users/${user.auth_data.uid}/pending_matches`
			);
			const q = query(pendingMatchesCollection, orderBy('timestamp', 'desc'), limit(1));

			unsubUser = onSnapshot(userRef, (snapshot) => {
				if (snapshot.exists()) {
					const updatedUserData = snapshot.data() as UserData;

					console.log('User updated');

					currentUser.update((val) => ({ ...val, ...updatedUserData }));
				}
			});

			unsubPendingMatch = onSnapshot(q, (snapshot) => {
				if (!snapshot.empty) {
					const newMatch = snapshot.docs[0].data() as Match;
					const newOpponent = newMatch.players.find(
						(player) => player.auth_data.uid !== user?.auth_data.uid
					) as UserData;

					console.log('Pending match snapshot');
					// console.log(newOpponent);

					pendingMatch = newMatch;
					latestOpponent.set(newOpponent);
				}
			});

			const matchesCollection = collection(db, 'match_sets');
			const matchQuery = query(
				matchesCollection,
				where('section', '==', user.personal_data.section)
			);

			unsubLatestMatchSet = onSnapshot(matchQuery, (snapshot) => {
				if (!snapshot.empty) {
					matchSet = snapshot.docs
						.map((match) => match.data() as MatchSet)
						.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)[0];

					console.log('Match set assigned');
				}
			});
		}

		// if (opponent) {
		// 	const opponentRef = doc(db, 'users', opponent.auth_data.uid);
		//
		// 	unsubOpponent = onSnapshot(opponentRef, (snapshot) => {
		// 		if (snapshot.exists()) {
		// 			const updatedOpponent = snapshot.data() as UserData;
		//
		// 			console.log('Opponent data updated');
		//
		// 			latestOpponent.update((val) => ({ ...val, ...updatedOpponent }));
		// 		}
		// 	});
		// }

		if (matchSetId) {
			const matchSetRef = doc(db, 'match_sets', matchSetId);

			unsubTimer = onSnapshot(matchSetRef, (snapshot) => {
				if (snapshot.exists()) {
					const newMatchSet = snapshot.data() as MatchSet;

					console.log('Match set updated');

					matchSet = newMatchSet;
				}
			});
		}

		// const timeLimit = 60 * 1000;
		//
		// if (matchSet) {
		// 	const currentTime = new Date().getTime();
		// 	const matchSetTimestamp = matchSet.timestamp.seconds * 1000;
		//
		// 	const timeRemaining = timeLimit - (currentTime - matchSetTimestamp);
		//
		// 	console.log('Current: ' + currentTime);
		// 	console.log('Match Set: ' + matchSetTimestamp);
		//
		// 	if (timeRemaining <= 0) {
		// 		matchSet.timer_expired = true;
		// 	}
		// }
	});

	onDestroy(() => {
		if (unsubTimer && unsubOpponent && unsubLatestMatchSet && unsubUser && unsubPendingMatch) {
			unsubTimer();
			unsubOpponent();
			unsubLatestMatchSet();
			unsubUser();
			unsubPendingMatch();
		}
	});
</script>

<!-- TODO: -->
<!-- Make things look better -->
<!-- Improve auth state management -->
<div class="flex h-full w-full flex-col items-center justify-center">
	{#if $currentUserCtx.auth_data.is_logged_in && $currentUserCtx.auth_data.is_registered}
		{@const initials = `${$currentUserCtx.personal_data.name.first[0]}${$currentUserCtx.personal_data.name.last[0]}`}

		<div class="w-full rounded-md overflow-hidden">
			<Banner />
			<UserAvatar user={$currentUserCtx} {initials} />
		</div>
		<div class="w-full space-y-6 mt-20 lg:mt-28">
			<Rank user={$currentUserCtx} />
			<div class="flex w-full flex-col gap-6 lg:flex-row">
				{#if pendingMatch}
					<UpcomingMatch {pendingMatch} />
				{/if}

				{#if !matchSet}
					<div
						class="bg-surface-300-600-token border-surface-400-500-token flex w-full flex-col border-token lg:w-1/2 lg:rounded-md"
					>
						<div class="flex justify-center items-center h-full">
							No match available, please wait for admin to queue.
						</div>
					</div>
				{:else if matchSet.timer_expired}
					<PowerCards user={$currentUserCtx} />
				{:else}
					<div
						class="bg-surface-300-600-token border-surface-400-500-token flex w-full flex-col border-token lg:w-1/2 lg:rounded-md"
					>
						<div class="flex justify-center items-center h-full">
							You can't use power cards yet, proceed to Battle page for card battle
						</div>
					</div>
				{/if}
			</div>
			{#if matchHistory && cardBattleHistory}
				<div class="flex w-full flex-col gap-6 lg:flex-row">
					<ArnisHistory history={matchHistory} />
					<CardBattleHistory history={cardBattleHistory} />
				</div>
			{/if}
		</div>

		{#if $selectedPowerCard}
			<ActivatePowerCard />
		{/if}
	{:else}
		<Login {sections} />
	{/if}
</div>
