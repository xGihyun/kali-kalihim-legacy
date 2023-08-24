<script lang="ts">
	import { blockCards, strikeCards } from '$lib/data';
	import type { UserData, CardBattle } from '$lib/types';
	import { Avatar } from '@skeletonlabs/skeleton';
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
									<div
										class="w-full items-center justify-center sm:w-3/4 flex flex-col gap-8 relative shadow-xl bg-surface-100-800-token rounded-container-token h-3/4 overflow-auto"
									>
										<button class="absolute top-0 right-0 p-2" on:click={() => toggleRow(idx)}
											>X</button
										>
										<div
											class="w-full flex flex-col gap-8 shadow-xl bg-surface-100-800-token rounded-container-token h-full overflow-auto"
										>
											{#each players as player (player.auth_data.uid)}
												{@const name = `${player.personal_data.name.first} ${player.personal_data.name.last}`}
												<div class="flex flex-col gap-2">
													<span
														class={`font-gt-walsheim-pro-medium text-base sm:text-lg w-full p-4 flex bg-surface-400-500-token ${
															player.auth_data.uid === $currentUser.auth_data.uid
																? 'text-tertiary-300'
																: 'text-white'
														}`}
													>
														{name}
													</span>
													<div class="flex flex-col lg:flex-row gap-4 lg:overflow-auto p-4">
														{#each player.turns as turn, idx (idx)}
															{@const battleCard = player.battle_cards[idx]}
															<div class="flex-1 flex gap-2">
																<div class="sm:text-base text-sm">
																	<span>
																		{idx + 1}.
																	</span>
																	<!-- <span class="text-primary-500">.</span> -->
																</div>
																<div class="flex flex-col w-full gap-2 flex-1 sm:text-base text-sm">
																	{#if battleCard.skill === 'strike'}
																		{@const strikeCard = strikeCards.get(battleCard.name)}

																		{#if strikeCard}
																			{@const { accuracy, damage, effect, name } = strikeCard}

																			<div class="flex flex-col">
																				<span class="font-gt-walsheim-pro-medium text-secondary-300"
																					>{name}</span
																				>
																			</div>

																			{#if turn.is_cancelled}
																				<span>Blocked!</span>
																			{:else if damage > 0}
																				<div class="flex flex-col">
																					<span>Damage: {damage}</span>
																					<span>Accuracy: {accuracy * 100}%</span>
																				</div>
																				<span>Hit!</span>
																				<div>
																					<!-- <p>
																			Damage dealt:
																			<span class="text-primary-400">
																				{turn.damage}
																			</span>
																		</p> -->
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
																							on
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
																			{@const { name, reduction } = blockCard}

																			<span class="font-gt-walsheim-pro-medium text-secondary-300"
																				>{name}</span
																			>
																			<span>DMG Reduction: {reduction * 100}%</span>
																		{/if}
																	{/if}
																</div>
															</div>
														{/each}
													</div>
												</div>
											{/each}
											<!-- <div class="flex justify-end"> -->
											<!-- 	<button class="btn variant-filled-primary" on:click={() => toggleRow(idx)} -->
											<!-- 		>Close</button -->
											<!-- 	> -->
											<!-- </div> -->
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
