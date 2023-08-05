<script lang="ts">
	import { enhance } from '$app/forms';
	import type { CardBattle, MatchSets } from '$lib/types';
	import { onMount } from 'svelte';
	import { Table } from '../placeholders';

	export let matchSets: MatchSets[];
	let matchSetId: string;
	let cardBattle: CardBattle[] = [];
	type LoadState = 'loading' | 'done';

	let clickedRow: number | null = null;
	let state: LoadState = 'loading';

	function refreshCardBattle(data: unknown) {
		const newData = data as CardBattle[];

		cardBattle = newData;
	}

	async function getCardBattleMatch() {
		state = 'loading';

		const response = await fetch('/api/match/card-battle', {
			method: 'POST',
			body: JSON.stringify({ matchSetId })
		});

		if (!response.ok) {
			throw new Error('Error in fetching arnis matches: ' + response.statusText);
		}

		const data = await response.json();

		cardBattle = data as CardBattle[];

		state = 'done';
	}

	onMount(() => {
		matchSetId = matchSets[0].id;
		getCardBattleMatch();
	});
</script>

<div class="hidden lg:block space-x-2">
	{#each matchSets as matchSet, idx (idx)}
		<button
			class={`btn ${matchSetId === matchSet.id ? 'variant-filled' : 'variant-outline'}`}
			on:click={() => {
				matchSetId = matchSet.id;
				getCardBattleMatch();
			}}
		>
			Match {matchSet.data.set}
		</button>
	{/each}
</div>

<div class="flex h-full w-full flex-col items-center">
	{#if state === 'done'}
		<form
			method="post"
			action="?/card_battle"
			use:enhance={({ formData }) => {
				formData.append('card_battle', JSON.stringify(cardBattle));
				formData.append('match_set_id', matchSetId);

				return async ({ result }) => {
					if (result.type === 'success') {
						const { data } = result;

						console.log(data);

						if (!data) {
							throw new Error('Data undefined after running card battle.');
						}

						const updated = data.cardBattleResults;

						refreshCardBattle(updated);
					} else {
						throw new Error('Failed to run card battle.');
					}
				};
			}}
		>
			<button class="btn variant-filled-primary" type="submit">Run card battle</button>
		</form>
		<div class="table-container max-w-5xl">
			<table class="table-hover table-interactive table-compact table">
				<thead>
					<tr class="text-sm md:text-base">
						<th>Player 1</th>
						<th>Damage</th>
						<th>VS</th>
						<th>Player 2</th>
						<th>Damage</th>
					</tr>
				</thead>
				<tbody>
					{#if cardBattle}
						{#each cardBattle as battles, idx (idx)}
							{@const players = battles.players}

							<tr>
								{#each players as player, idx (player.auth_data.uid)}
									{@const name = `${player.personal_data.name.first} ${player.personal_data.name.last}`}
									{@const totalDamage = player.total_damage}

									<td>
										<span>{name}</span>
									</td>

									{#if totalDamage !== null}
										<td>
											{totalDamage.toFixed(2)}
										</td>
									{:else}
										<td class="italic opacity-75">null</td>
									{/if}

									{#if idx < 1}
										<td>
											<span class="uppercase text-primary-500-400-token">vs</span>
										</td>
									{/if}
								{/each}
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	{:else}
		<Table />
	{/if}
</div>
