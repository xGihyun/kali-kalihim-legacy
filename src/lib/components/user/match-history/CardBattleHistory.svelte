<script lang="ts">
	import { blockCards, strikeCards } from '$lib/data';
	import type { UserData, CardBattle } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let history: CardBattle[];
	let clickedRow: number | null = null;
	function toggleRow(idx: number) {
		clickedRow = clickedRow === idx ? null : idx;
	}

	const currentUser = getContext<Writable<UserData>>('user');
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

						<tr
							on:click={() => {
								toggleRow(idx);
							}}
						>
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

						{#if clickedRow === idx}
							<div class="fixed left-0 top-0 z-[999] h-full w-full bg-surface-backdrop-token">
								<div class="flex h-full w-full items-center justify-center">
									<div
										class="w-modal space-y-4 p-4 shadow-xl bg-surface-100-800-token rounded-container-token max-h-96 overflow-auto"
									>
										<div class="flex gap-4 sm:flex-row flex-col">
											{#each players as player (player.auth_data.uid)}
												{@const name = `${player.personal_data.name.first} ${player.personal_data.name.last}`}

												<div class="flex flex-col gap-2">
													<span
														class={`font-gt-walsheim-pro-medium text-lg ${
															player.auth_data.uid === $currentUser.auth_data.uid
																? 'text-tertiary-300'
																: 'text-white'
														}`}
													>
														{name}
													</span>
													{#each player.turns as turn, idx (idx)}
														{@const battleCard = player.battle_cards[idx]}

														<div class="flex flex-col h-60 gap-2">
															{#if battleCard.skill === 'strike'}
																{@const strikeCard = strikeCards.get(battleCard.name)}

																{#if strikeCard}
																	{@const { accuracy, damage, effect, name } = strikeCard}

																	<div class="flex flex-col">
																		<span class="font-gt-walsheim-pro-medium">{name}</span>
																	</div>

																	{#if turn.is_cancelled}
																		<span>Blocked!</span>
																	{:else if damage > 0}
																		<span>Damage: {damage}</span>
																		<span>Accuracy: {accuracy * 100}%</span>
																		<span>Hit!</span>
																		<div>
																			<p>
																				Damage dealt:
																				<span class="text-primary-400">
																					{turn.damage}
																				</span>
																			</p>
																			<div>
																				<span>Bonus effect:</span>
																				<p>
																					{#if effect.type === 'increase'}
																						<span class="text-success-500">
																							+{effect.amount * 100}%
																						</span>
																					{:else}
																						<span class="text-error-500">
																							-{effect.amount * 100}%
																						</span>
																					{/if}

																					{effect.stat}

																					{effect.target === 'self' ? "user's" : "opponent's"}
																					next turn
																				</p>
																			</div>
																		</div>
																	{:else}
																		<span>Missed!</span>
																	{/if}
																{/if}
															{:else}
																{@const blockCard = blockCards.get(battleCard.name)}

																{#if blockCard}
																	{@const { effect, name, reduction } = blockCard}

																	<span class="font-gt-walsheim-pro-medium">{name}</span>
																	<span>Damage Reduction: {reduction * 100}%</span>
																{/if}
															{/if}
														</div>
													{/each}
												</div>
											{/each}
										</div>
										<button on:click={() => toggleRow(idx)}>X</button>
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
