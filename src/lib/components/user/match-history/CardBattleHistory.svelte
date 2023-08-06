<script lang="ts">
	import type { CardBattle } from '$lib/types';

	export let history: CardBattle[];
</script>

<div class="w-full lg:w-1/2">
	<div class="bg-surface-300-600-token border-surface-400-500-token border-token lg:rounded-md">
		<div class="flex h-20 w-full items-center gap-4 px-main">
			<span class="w-full text-2xl uppercase">card battle match history</span>
		</div>
		<div class="table-container">
			<table class="table-hover table-compact table">
				<tbody>
					{#each history as battles, idx (idx)}
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
				</tbody>
			</table>
		</div>
	</div>
</div>
