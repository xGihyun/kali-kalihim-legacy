<script lang="ts">
	import { enhance } from '$app/forms';
	import type { CardBattle, MatchSets } from '$lib/types';
	import { getCardBattle } from '$lib/utils/functions';
	import { onMount } from 'svelte';
	import { Table } from '../placeholders';

	export let matchSets: MatchSets[];
	let matchSetId: string;
	let cardBattleResult: Promise<CardBattle[]> | undefined;

	function refreshCardBattle(data: Promise<unknown>) {
		const newData = data as Promise<CardBattle[]>;

		cardBattleResult = newData;
	}

	onMount(() => {
		matchSetId = matchSets[0].id;
		cardBattleResult = getCardBattle(matchSetId);
	});
</script>

<div class="hidden lg:block">
	{#each matchSets as matchSet, idx (idx)}
		<button
			class="btn variant-filled"
			on:click={() => {
				matchSetId = matchSet.id;
				cardBattleResult = getCardBattle(matchSetId);
			}}
		>
			Match {matchSet.data.set}
		</button>
	{/each}
</div>
{#await cardBattleResult}
	<Table />
{:then cardBattle}
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

					const updated = Promise.resolve(data.cardBattleResults);

					refreshCardBattle(updated);
				} else {
					throw new Error('Failed to run card battle.');
				}
			};
		}}
	>
		<button class="btn variant-ghost" type="submit">Run all card battle</button>
	</form>
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
				{/if}
			</tbody>
		</table>
	</div>
{/await}
