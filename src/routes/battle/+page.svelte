<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BattleCard, LoadState, MatchSet } from '$lib/types';
	import { blockCards, strikeCards } from '$lib/data';
	import { Toast, toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import { db } from '$lib/firebase/firebase.js';
	import {
		Timestamp,
		collection,
		doc,
		onSnapshot,
		query,
		updateDoc,
		where
	} from 'firebase/firestore';
	import type { Unsubscribe } from 'firebase/auth';

	export let data;

	$: ({ matchSet, matchSetId, user } = data);

	$: cardsInQueue = [] as BattleCard[];
	$: selected = [] as string[];

	let submitState: LoadState = 'done';

	function addToQueue(card: BattleCard): void {
		if (cardsInQueue.length > 5) return;

		cardsInQueue = [...cardsInQueue, card];
		selected = [...selected, card.name];
	}

	function removeInQueue(index: number, card: string): void {
		cardsInQueue = cardsInQueue.filter((_, i) => i !== index);
		selected = selected.filter((name) => name !== card);
	}

	const submitting: ToastSettings = {
		message: 'Submitting battle cards...',
		background: 'variant-filled-primary'
	};

	const submitted: ToastSettings = {
		message: 'Battle cards have been submitted!',
		background: 'variant-filled-primary',
		autohide: false
	};

	// NOTE: 6 hours in ms
	const timeLimit = 60 * 1000;

	let remainingHours = 0;
	let remainingMinutes = 0;
	let remainingSeconds = 0;

	async function updateTimerExpiration(
		timeRemaining: number,
		timer: NodeJS.Timeout | undefined
	): Promise<void> {
		if (!matchSetId) return;

		if (timeRemaining <= 0) {
			const matchSetRef = doc(db, 'match_sets', matchSetId);

			await updateDoc(matchSetRef, { timer_expired: true });

			clearInterval(timer);

			console.log('Match set timer is expired');
			console.log('Cleared timer interval');

			remainingHours = 0;
			remainingMinutes = 0;
			remainingSeconds = 0;
		} else {
			remainingHours = Math.floor(timeRemaining / (1000 * 60 * 60));
			remainingMinutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
			remainingSeconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
		}
	}

	let timerInterval: NodeJS.Timeout | undefined;

	function startTimer(): void {
		timerInterval = setInterval(updateTimer, 1000);
		updateTimer();
	}

	async function updateTimer(): Promise<void> {
		if (!matchSet) return;

		const currentTime = new Date().getTime();
		const timestamp = matchSet.timestamp.seconds * 1000;

		const timeRemaining = timeLimit - (currentTime - timestamp);

		await updateTimerExpiration(timeRemaining, timerInterval);
	}

	let unsubLatestMatchSet: Unsubscribe;
	let unsubTimer: Unsubscribe;

	onMount(async () => {
		console.log('Mounting...');

		if (user) {
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
					console.log('Starting timer...');

					startTimer();
				}
			});
		}

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

		// if (matchSet) {
		// 	console.log('Starting timer...');
		// 	startTimer();
		// }

		// if (matchSet && matchSetId) {
		// 	const currentDate = new Date();
		// 	const currentTimestamp = Timestamp.fromDate(currentDate);
		// 	const matchTimestamp = matchSet.timestamp;
		//
		// 	if (matchTimestamp.seconds > currentTimestamp.seconds) {
		// 		console.log('Timer not expired yet, starting timer...');
		// 		startTimer();
		// 	} else {
		// 		console.log('Timer is already expired.');
		//
		// 		// If for some reason timer_expired is still false
		// 		if (!matchSet.timer_expired) {
		// 			console.log('Updating timer expiration...');
		// 			const matchSetRef = doc(db, 'match_sets', matchSetId);
		//
		// 			await updateDoc(matchSetRef, { timer_expired: true });
		// 		}
		// 	}
		// }
	});

	onDestroy(() => {
		if (unsubTimer && unsubLatestMatchSet) {
			unsubTimer();
			unsubLatestMatchSet();
		}
		clearInterval(timerInterval);
	});
</script>

<Toast />

<div class="relative flex h-full w-full flex-col items-center gap-10 px-main py-10">
	{#if !matchSet}
		<div>No match available, please wait for admin to queue.</div>
	{:else if matchSet.timer_expired}
		<div>
			<p>6 hour timer has now expired. You can no longer submit battle cards.</p>
			<p>If a match has already been queued, refresh to get the latest updated state.</p>
		</div>
	{:else}
		<div>Timer: {remainingHours}:{remainingMinutes}:{remainingSeconds}</div>
		<div>
			<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Strikes</h2>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
				{#each strikeCards as [_, value], idx (idx)}
					<button
						class="bg-surface-400-500-token flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
						on:click={() => {
							addToQueue({ name: value.name, skill: 'strike' });
						}}
						disabled={selected.includes(value.name)}
					>
						<span>{value.name}</span>
					</button>
				{/each}
			</div>
		</div>
		<div>
			<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Blocks</h2>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
				{#each blockCards as [_, value], idx (idx)}
					<button
						class="bg-surface-400-500-token flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
						on:click={() => {
							addToQueue({ name: value.name, skill: 'block' });
						}}
						disabled={selected.includes(value.name)}
					>
						<span>{value.name}</span>
					</button>
				{/each}
			</div>
		</div>

		{#if cardsInQueue.length > 0 && submitState === 'done'}
			<div class="fixed bottom-10">
				<div
					class="relative z-10 grid grid-cols-3 place-items-center gap-2 md:grid-cols-6 lg:gap-4"
				>
					{#each cardsInQueue as card, idx (idx)}
						<button
							class="bg-surface-500-400-token flex aspect-[1/1.3] w-20 flex-col rounded-md lg:w-32 lg:gap-1"
							on:click={() => removeInQueue(idx, card.name)}
						>
							<span>{card.name}</span>
						</button>
					{/each}
				</div>
				<form
					method="post"
					action="?/battle"
					use:enhance={({ formData }) => {
						submitState = 'loading';

						toastStore.trigger(submitting);
						formData.append('battle_cards', JSON.stringify(cardsInQueue));

						return async ({ result }) => {
							if (result.type === 'success') {
								submitState = 'done';
								cardsInQueue = [];
								toastStore.trigger(submitted);
							}
						};
					}}
				>
					<button
						class="btn variant-filled-primary"
						disabled={cardsInQueue.length < 6}
						type="submit"
					>
						Submit
					</button>
				</form>
			</div>
		{/if}
	{/if}
</div>
