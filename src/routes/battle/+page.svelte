<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BattleCard, LoadState } from '$lib/types';
	import { blockCards, strikeCards } from '$lib/data';
	import { Toast, toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import { db } from '$lib/firebase/firebase.js';
	import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
	import { timerExpired } from '$lib/store.js';

	export let data;

	$: ({ matchSet } = data);

	$: cardsInQueue = [] as BattleCard[];
	$: selected = [] as string[];

	let submitState: LoadState = 'done';

	function addToQueue(card: BattleCard) {
		if (cardsInQueue.length > 5) return;

		cardsInQueue = [...cardsInQueue, card];
		selected = [...selected, card.name];
	}

	function removeInQueue(index: number, card: string) {
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

	// 6 hours in ms

	const timeLimit = 6 * 60 * 60 * 1000;

	let remainingHours = 0;
	let remainingMinutes = 0;
	let remainingSeconds = 0;

	async function updateTimerExpiration(timeRemaining: number) {
		if (!matchSet) return;

		if (timeRemaining <= 0) {
			const matchSetRef = doc(db, 'match_sets', matchSet.id);

			await updateDoc(matchSetRef, { timer_expired: true });

			remainingHours = 0;
			remainingMinutes = 0;
			remainingSeconds = 0;
		} else {
			remainingHours = Math.floor(timeRemaining / (1000 * 60 * 60));
			remainingMinutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
			remainingSeconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
		}
	}

	async function updateTimer() {
		if (!matchSet) return;

		const currentTime = new Date().getTime();
		const timestamp = matchSet.timestamp.seconds * 1000;

		const timeRemaining = timeLimit - (currentTime - timestamp);

		await updateTimerExpiration(timeRemaining);
	}

	$: {
		if (matchSet) {
			const matchSetRef = doc(db, 'match_sets', matchSet.id);

			const unsubTimer = onSnapshot(matchSetRef, (snapshot) => {
				if (!snapshot.exists()) return;

				const expired = snapshot.data().timer_expired as boolean;

				timerExpired.update((val) => (val = expired));
			});

			onDestroy(() => unsubTimer());
		}
		updateTimer();

		const timerInterval = setInterval(updateTimer, 1000);

		onDestroy(() => clearInterval(timerInterval));
	}
</script>

<Toast />

<div class="relative flex h-full w-full flex-col items-center gap-10 px-main py-10">
	{$timerExpired}
	{#if !$timerExpired}
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
	{:else}
		<div>6 hour timer has now expired. You can no longer submit battle cards.</div>
	{/if}
</div>
