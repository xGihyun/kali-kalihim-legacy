<script lang="ts">
	import { Close } from '$lib/assets/icons';
	import { blockCards, strikeCards } from '$lib/data';
	import type { UserData, CardBattle } from '$lib/types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { getContext, onMount } from 'svelte';
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
		<div class="w-full">
			<table class="w-full">
				<thead>
					<tr class="text-left text-xs lg:text-sm opacity-75 [&>th]:pb-2 [&>th]:px-main">
						<th class="w-1/2">Opponent</th>
						<th>DMG Given</th>
						<th>DMG Received</th>
					</tr>
				</thead>
				<tbody class="[&>tr:nth-child(even)]:bg-surface-700 [&>tr:nth-child(odd)]:bg-surface-800">
					{#each history as battles, idx (idx)}
						{@const players = battles.players}
						{@const userPlayer = battles.players.filter(
							(user) => user.auth_data.uid === $currentUser.auth_data.uid
						)[0]}
						{@const opponent = battles.players.filter(
							(user) => user.auth_data.uid !== $currentUser.auth_data.uid
						)[0]}
						{@const opponentName = `${opponent.personal_data.name.first} ${opponent.personal_data.name.last}`}
						{@const opponentInitials = `${opponent.personal_data.name.first[0]} ${opponent.personal_data.name.last[0]}`}

						<tr
							class="[&>td]:py-2 [&>td]:px-main text-sm lg:text-base cursor-pointer hover:brightness-125 transition-[filter] duration-200"
							on:click={() => {
								toggleRow(idx);
							}}
						>
							<td>
								<div class="flex items-center gap-2">
									<Avatar
										src={opponent.auth_data.photo_url || ''}
										width="w-8"
										initials={opponentInitials}
									/>
									{opponentName}
								</div>
							</td>

							<td>
								{userPlayer.total_damage?.toFixed(2)}
							</td>

							<td>
								{opponent.total_damage?.toFixed(2)}
							</td>
						</tr>

						{#if clickedRow === idx}
							<div class="fixed left-0 top-0 z-[999] h-full w-full bg-surface-backdrop-token">
								<div class="flex h-full w-full items-center justify-center p-2">
									<!-- Modal -->
									<div
										class="w-full sm:w-3/4 flex flex-col relative shadow-xl bg-surface-100-800-token overflow-hidden rounded-container-token h-3/4"
									>
										<div class="w-full flex justify-between items-center p-4 gap-4 h-16">
											<h1 class="font-gt-walsheim-pro-medium text-2xl">Card Battle Results</h1>
											<button class="" on:click={() => toggleRow(idx)}>
												<Close styles="w-8 h-8" />
											</button>
										</div>

										<hr />

										<div class="w-full h-full flex overflow-auto p-4">
											{#each players as player (player.auth_data.uid)}
												{@const { personal_data, turns } = player}
												{@const playerName = `${personal_data.name.first} ${personal_data.name.last}`}
												{@const opponent = players.filter(
													(player) => $currentUser.auth_data.uid !== player.auth_data.uid
												)[0]}

												<div class="flex flex-col gap-4 w-full">
													<p class="font-gt-walsheim-pro-medium text-xl">
														{playerName}
														{#if player.auth_data.uid === $currentUser.auth_data.uid}
															<span>(You)</span>
														{/if}
													</p>

													<div class="flex flex-col gap-2 py-4">
														{#each turns as turn, idx (idx)}
															{@const battleCard = player.battle_cards[idx]}
															{@const { name, skill } = battleCard}
															{@const { damage, is_cancelled } = turn}

															{#if skill === 'block'}
																{@const blockCard = blockCards.get(name)}

																{#if blockCard}
																	{@const { name, effect, reduction, strike_to_cancel } = blockCard}
																	{@const damageReceived = opponent.turns[idx].damage}

																	<span class="text-tertiary-400">{name}</span>

																	<div class="flex flex-col">
																		<p>
																			Damage Reduction:
																			<span class="text-primary-400">
																				{reduction * 100}%
																			</span>
																		</p>
																		<p>
																			Damage Recevied:
																			<span class="text-primary-400">
																				{damageReceived}
																			</span>
																		</p>
																		<p>
																			Strike to Cancel:
																			<span class="text-primary-400">
																				{strike_to_cancel}
																			</span>
																		</p>
																	</div>
																{/if}
															{:else}
																{@const strikeCard = strikeCards.get(name)}

																{#if strikeCard}
																	{@const {
																		name,
																		effect,
																		damage: strikeDamage,
																		accuracy
																	} = strikeCard}
																	<span class="text-tertiary-400">{name}</span>
																	<div class="flex flex-col">
																		<p>
																			Damage:
																			<span class="text-primary-400">
																				{damage}
																			</span>
																		</p>

																		<p>
																			Accuracy:
																			<span class="text-primary-400">
																				{accuracy * 100}%
																			</span>
																		</p>

																		<p>
																			Result:
																			<span class="text-primary-400">
																				{#if is_cancelled}
																					Blocked!
																				{:else if damage > 0}
																					Hit!
																				{:else}
																					Missed!
																				{/if}
																			</span>
																		</p>
																	</div>
																{/if}
															{/if}
														{/each}
													</div>
												</div>
											{/each}
										</div>
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
