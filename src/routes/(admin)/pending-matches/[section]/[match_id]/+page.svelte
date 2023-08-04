<script lang="ts">
	import { enhance } from '$app/forms';
	import { CircleCheckFilled, ClockPause } from '$lib/assets/icons/index.js';
	import { db } from '$lib/firebase/firebase';
	import type { UserData } from '$lib/types';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';

	export let data;

	$: ({ cardBattle, matchSetId, matches } = data);

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

		const response = await fetch('/api/submit-score', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Error in submitting score: ' + response.statusText);
		}

		console.log('Scores submitted successfully!');
		form.reset();
		addToMatchHistory(users);
	}

	type BattleTab = 'arnis' | 'card_battle';

	let currentTab: BattleTab = 'arnis';
</script>

<div>{matchSetId}</div>
<div class="flex gap-4">
	<button class="btn variant-filled" on:click={() => (currentTab = 'arnis')}>Arnis</button>
	<button class="btn variant-filled" on:click={() => (currentTab = 'card_battle')}>Cards</button>
</div>

{#if currentTab === 'arnis'}
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
					{@const players = match.players}

					<tr
						class={`${
							match.status === 'finished' ? 'pointer-events-none opacity-50' : 'opacity-100'
						}`}
						on:click={() => toggleRow(idx)}
					>
						{#each players as player, idx (player.auth_data.uid)}
							{@const name = `${player.personal_data.name.first} ${player.personal_data.name.last}`}
							<td class="flex gap-2">
								<span class="text-xs md:text-sm">{name}</span>
								{#if player.power_cards.find((card) => card.activated && !card.used)}
									<div>
										{#each player.power_cards as card, idx (idx)}
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
							{#if idx < 1}
								<td>
									<span class="uppercase text-primary-500-400-token">vs</span>
								</td>
							{/if}
						{/each}
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

					<!-- Separate component? -->
					<!-- Change to dialog -->
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
										{#each match.players as user (user.auth_data.uid)}
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
{:else}
	<form
		method="post"
		action="?/card_battle"
		use:enhance={(e) => {
			e.formData.append('card_battle', JSON.stringify(cardBattle));

			return async ({ result }) => {
				if (result.type === 'success') {
					const { data } = result;
					console.log(data);

					if (!data) {
						throw new Error('Data undefined after running card battle.');
					}

					// Ignore weird TS errors, this will work fine
					cardBattle = data.cardBattleResults;
				} else {
					throw new Error('Failed to run card battle.');
				}
			};
		}}
	>
		<button class="btn variant-ghost" type="submit">Run all card battle</button>
	</form>
	<!-- <button class="btn variant-ghost" on:click={runCardBattle}>Run all card battle client</button> -->
	<div class="table-container max-w-5xl">
		<table class="table-hover table-interactive table-compact table">
			<thead>
				<tr class="text-sm md:text-base">
					<th>Player 1</th>
					<th>VS</th>
					<th>Player 2</th>
					<th>Results</th>
				</tr>
			</thead>
			<tbody>
				{#each cardBattle as battles, idx (idx)}
					{@const players = battles.players}
					<tr>
						{#each players as player, idx (player.auth_data.uid)}
							{@const name = `${player.personal_data.name.first} ${player.personal_data.name.last}`}
							{@const totalDamage = player.total_damage}
							<td>
								<span>{name}</span>
							</td>
							{#if idx < 1}
								<td>
									<span class="uppercase text-primary-500-400-token">vs</span>
								</td>
							{/if}
							{#if totalDamage !== null}
								<span class="text-base">
									{totalDamage.toFixed(2)}
								</span>
							{:else}
								<span class="italic opacity-75 text-base">null</span>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
