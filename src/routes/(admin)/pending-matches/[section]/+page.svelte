<script lang="ts">
	import { page } from '$app/stores';
	import { CircleCheckFilled, ClockPause } from '$lib/assets/icons/index.js';
	import { db } from '$lib/firebase/firebase';
	import type { Match, MatchSet, UserData } from '$lib/types';
	import { TabGroup, TabAnchor, type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import {
		Timestamp,
		addDoc,
		collection,
		doc,
		getDoc,
		getDocs,
		onSnapshot,
		query,
		where
	} from 'firebase/firestore';
	import { afterUpdate, onDestroy, onMount } from 'svelte';

	export let data;

	$: ({ matchSets, section } = data);

	let clickedRow: number | null = null;

	function toggleRow(idx: number) {
		clickedRow = clickedRow === idx ? null : idx;
	}

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', data.section));
	const unsubMatchSets = onSnapshot(matchQuery, (snapshot) => {
		matchSets = snapshot.docs
			.map((matchSet) => {
				const matchSetId = matchSet.id;
				const matchSetData = matchSet.data() as MatchSet;

				return {
					id: matchSetId,
					data: matchSetData
				};
			})
			.sort((a, b) => a.data.set - b.data.set);

		console.log('Updated match sets.');
	});

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
	// $: match = 'Match';

	// const matchPopup: PopupSettings = {
	// 	event: 'click',
	// 	target: 'matches',
	// 	placement: 'bottom'
	// };

	onDestroy(() => unsubMatchSets());

	async function getMatch(matchSetId: string): Promise<Match[]> {
		const matchSetRef = doc(db, `match_sets/${matchSetId}`);
		const matchSetDoc = await getDoc(matchSetRef);

		if (!matchSetDoc.exists) {
			throw new Error("Match set doesn't exist");
		}

		const matchesCollection = collection(db, `match_sets/${matchSetId}/matches`);
		const matchesDocs = await getDocs(matchesCollection);

		let matches = matchesDocs.docs.map(
			(match) => JSON.parse(JSON.stringify(match.data())) as Match
		);

		return matches;
	}

	let matchesResult: Promise<Match[]> | undefined;
	let matchSetId: string;

	onMount(() => {
		if (matchSets) {
			matchSetId = matchSets[0].id;
			matchesResult = getMatch(matchSetId);
		}
	});

	afterUpdate(() => {
		if (matchSets) {
			matchSetId = matchSets[0].id;
			matchesResult = getMatch(matchSetId);
		}
	});
</script>

<div>{section}</div>
<div>{matchSetId}</div>
<div class="flex h-full w-full flex-col items-center justify-center py-10">
	{#if matchSets && matchSets.length > 0}
		<h1 class="mb-5 text-center font-gt-walsheim-pro-medium text-2xl uppercase">
			{section}
		</h1>
		<div class="hidden lg:block">
			<!-- <TabGroup justify="justify-center"> -->
			{#each matchSets as matchSet, idx (idx)}
				<button
					class="btn variant-filled"
					on:click={() => {
						matchSetId = matchSet.id;
						matchesResult = getMatch(matchSetId);
					}}
				>
					Match {matchSet.data.set}
				</button>
				<!-- <TabAnchor
						href={`/pending-matches/${data.section}/${matchSet.id}`}
						selected={$page.url.pathname === `/pending-matches/${data.section}/${matchSet.id}`}
					>
						Match {matchSet.data.set}
						{matchSet.id}
					</TabAnchor> -->
			{/each}
			<!-- </TabGroup> -->
		</div>
		{#if matchesResult}
			<div class="flex h-full w-full flex-col items-center justify-center">
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
							{#await matchesResult then matches}
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
														on:submit|preventDefault={(e) =>
															handleSubmit(e, match.players, matchSetId)}
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
															<button class="btn variant-filled-primary" type="submit"
																>Submit</button
															>
														</div>
													</form>
												</div>
											</div>
										</div>
									{/if}
								{/each}
							{/await}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
		<!-- <button class="btn flex variant-filled w-48 justify-between lg:hidden" use:popup={matchPopup}>
			<span class="capitalize">{match}</span>
			<span>↓</span>
		</button>
		<div class="card w-48 py-2 shadow-xl" data-popup="matches">
			<ul>
				{#each matchSets as matchSet, idx (idx)}
					<li class="flex">
						<a
							class={`flex-1 px-4 py-2 ${
								match === `Match ${matchSet.data.set}`
									? 'variant-filled'
									: 'bg-surface-100-800-token hover:variant-soft'
							}`}
							href={`/pending-matches/${data.section}/${matchSet.id}`}
							on:click={() => (match = `Match ${matchSet.data.set}`)}
						>
							Match {matchSet.data.set}
						</a>
					</li>
				{/each}
			</ul>
			<div class="arrow bg-surface-100-800-token" />
		</div> -->

		<div class="flex h-full w-full flex-col items-center justify-center">
			<slot />
		</div>
	{:else}
		<div>No matches available</div>
	{/if}
</div>
