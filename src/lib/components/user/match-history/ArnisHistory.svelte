<script lang="ts">
	import type { ArnisMatchHistory } from '$lib/types';

	export let history: ArnisMatchHistory[];
</script>

<div class="w-full lg:w-1/2">
	<div class="bg-surface-300-600-token border-surface-400-500-token border-token lg:rounded-md">
		<div class="flex h-20 w-full items-center gap-4 px-main">
			<span class="w-full text-2xl uppercase">arnis match history</span>
		</div>
		<div class="table-container">
			<table class="table-hover table-compact table">
				<!-- <thead>
					<tr class="text-sm md:text-base">
						<th>Player 1</th>
						<th>VS</th>
						<th>Player 2</th>
						<th>Skill</th>
						<th>Footwork</th>
					</tr>
				</thead> -->
				<tbody>
					{#each history as match, idx (idx)}
						{@const players = match.players}

						<tr>
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
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
