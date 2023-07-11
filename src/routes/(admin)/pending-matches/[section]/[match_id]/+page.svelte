<script lang="ts">
	import CircleCheckFilled from '$lib/assets/icons/CircleCheckFilled.svelte';
	import ClockPause from '$lib/assets/icons/ClockPause.svelte';
	import { db } from '$lib/firebase/firebase';
	import type { Match, UserData } from '$lib/types';
	import { Timestamp, addDoc, collection, onSnapshot } from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	export let data;

	$: matches = data.matches;
	$: matchSetId = data.matchSetId;

	let clickedRow: number | null = null;

	function toggleRow(idx: number) {
		clickedRow = clickedRow === idx ? null : idx;
	}

	function addToMatchHistory(users: UserData[]) {
		const currentDate = new Date();

		const matchHistoryData = {
			players: [...users],
			timestamp: Timestamp.fromDate(currentDate)
		};

		users.forEach(async (user) => {
			const matchHistoryCollection = collection(db, `users/${user.auth_data.uid}/match_history`);

			await addDoc(matchHistoryCollection, matchHistoryData);
		});
	}

	// Might change this to a form action instead?
	async function handleSubmit(event: SubmitEvent, users: UserData[], matchSetId: string) {
		const form = event?.target as HTMLFormElement;
		const formData = new FormData(form);

		formData.append('matchSetId', matchSetId);
		formData.append('userUid', users[0].auth_data.uid);

		const response = await fetch('../../../api/submit-score', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			console.error('Error submitting form: ', response.statusText);
			return;
		}

		console.log('Scores submitted successfully!');
		form.reset();
		addToMatchHistory(users);
	}

	$: {
		if (matchSetId) {
			const matchSetCollection = collection(db, `match_sets/${matchSetId}/matches`);
			const unsubMatches = onSnapshot(matchSetCollection, (snapshot) => {
				matches = snapshot.docs.map((match) => match.data() as Match);
			});

			console.log('Match set snapshot ran.');

			onDestroy(() => unsubMatches());
		}
	}
</script>

<div class="table-container max-w-5xl">
	<table class="table-hover table-interactive table-compact table">
		<thead>
			<tr class="text-sm md:text-base">
				<th>Player 1</th>
				<th>VS</th>
				<th>Player 2</th>
				<th>Skill</th>
				<th>Footwork</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each matches as match, idx (idx)}
				{@const player1 = match.players[0]}
				{@const player2 = match.players[1]}

				<tr
					class={`${
						match.status === 'finished' ? 'pointer-events-none opacity-50' : 'opacity-100'
					}`}
					on:click={() => toggleRow(idx)}
				>
					<td class="flex gap-2">
						<p class="text-xs md:text-sm">
							{player1.personal_data.name.first}
							{player1.personal_data.name.last}
						</p>
						{#if player1.power_cards.find((card) => card.activated && !card.used)}
							<div>
								{#each player1.power_cards as card, idx (idx)}
									{#if card.activated && !card.used}
										{@const words = card.name.split(' ')}
										<span class="uppercase">
											{#each words as word, idx (idx)}
												{word[0]}
											{/each}
										</span>
									{/if}
								{/each}
							</div>
						{/if}
					</td>
					<td>
						<span class="uppercase text-primary-500-400-token">vs</span>
					</td>
					<td class="flex gap-2">
						<p class="text-xs md:text-sm">
							{player2.personal_data.name.first}
							{player2.personal_data.name.last}
						</p>
						{#if player2.power_cards.find((card) => card.activated && !card.used)}
							<div>
								{#each player2.power_cards as card, idx (idx)}
									{#if card.activated && !card.used}
										{@const words = card.name.split(' ')}
										<span class="uppercase">
											{#each words as word, idx (idx)}
												{word[0]}
											{/each}
										</span>
									{/if}
								{/each}
							</div>
						{/if}
					</td>
					<td class="w-44">
						<p class="text-xs md:text-sm">{match.skill}</p>
					</td>
					<td class="w-44">
						<p class="text-xs md:text-sm">{match.footwork}</p>
					</td>
					<td class="w-20">
						{#if match.status === 'pending'}
							<div title="Pending">
								<ClockPause styles="w-5 h-5 text-yellow-500" />
							</div>
						{:else}
							<div title="Finished">
								<CircleCheckFilled styles="w-5 h-5 text-green-500" />
							</div>
						{/if}
					</td>
				</tr>

				<!-- Modal -->
				{#if clickedRow === idx}
					<div class="fixed left-0 top-0 z-[999] h-full w-full bg-surface-backdrop-token">
						<div class="flex h-full w-full items-center justify-center">
							<div
								class="w-modal space-y-4 p-4 shadow-xl bg-surface-100-800-token rounded-container-token"
							>
								<form
									class="space-y-4"
									on:submit|preventDefault={(e) => handleSubmit(e, match.players, matchSetId)}
								>
									{#each match.players as user, idx (idx)}
										<!-- {#if data.matchSet.set === 1}
											<label class="label">
												<span
													>Initial score for {user.personal_data.name.first}
													{user.personal_data.name.last}</span
												>
												<input
													class="input"
													type="text"
													name={`initial-score-${user.auth_data.uid}`}
													required
												/>
											</label>
										{/if} -->
										<label class="label">
											<span>
												Score for
												{user.personal_data.name.first}
												{user.personal_data.name.last}
											</span>
											<input
												class="input text-token"
												type="text"
												name={`score-${user.auth_data.uid}`}
												required
											/>
										</label>
									{/each}
									<div class="flex justify-end gap-4">
										<button
											class="btn variant-ghost-surface text-token"
											type="button"
											on:click={() => (clickedRow = null)}>Cancel</button
										>
										<button class="btn variant-filled-primary" type="submit">Submit</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
