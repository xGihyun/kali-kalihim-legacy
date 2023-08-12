<script lang="ts">
	import type { ArnisMatchHistory, UserData } from '$lib/types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let history: ArnisMatchHistory[];

	const currentUser = getContext<Writable<UserData>>('user');
</script>

<div class="w-full lg:w-1/2">
	<div class="bg-surface-300-600-token border-surface-400-500-token border-token lg:rounded-md">
		<div class="flex h-20 w-full items-center gap-4 px-main">
			<span class="w-full text-2xl uppercase">arnis match history</span>
		</div>
		<div class="w-full">
			<table class="w-full">
				<thead>
					<tr class="text-left text-xs lg:text-sm opacity-75 [&>th]:pb-2 [&>th]:px-main">
						<th class="w-1/2">Opponent</th>
						<th>Skill</th>
						<th>Footwork</th>
					</tr>
				</thead>
				<tbody class="[&>tr:nth-child(even)]:bg-surface-700 [&>tr:nth-child(odd)]:bg-surface-800">
					{#each history as match, idx (idx)}
						{@const { skill, footwork } = match}
						{@const opponent = match.players.filter(
							(user) => user.auth_data.uid !== $currentUser.auth_data.uid
						)[0]}
						{@const opponentName = `${opponent.personal_data.name.first} ${opponent.personal_data.name.last}`}
						{@const opponentInitials = `${opponent.personal_data.name.first[0]} ${opponent.personal_data.name.last[0]}`}

						<tr class="[&>td]:py-2 [&>td]:px-main text-sm lg:text-base">
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
								{skill}
							</td>
							<td>
								{footwork}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<!-- <div class="table-container"> -->
		<!-- 	<table class="table-hover table-compact table"> -->
		<!-- 		<!-- <thead> -->
		<!-- 			<tr class="text-sm md:text-base"> -->
		<!-- 				<th>Player 1</th> -->
		<!-- 				<th>VS</th> -->
		<!-- 				<th>Player 2</th> -->
		<!-- 				<th>Skill</th> -->
		<!-- 				<th>Footwork</th> -->
		<!-- 			</tr> -->
		<!-- 		</thead> -->
		<!-- 		<tbody> -->
		<!-- 			{#each history as match, idx (idx)} -->
		<!-- 				{@const players = match.players} -->
		<!---->
		<!-- 				<tr> -->
		<!-- 					{#each players as player, idx (player.auth_data.uid)} -->
		<!-- 						{@const name = `${player.personal_data.name.first} ${player.personal_data.name.last}`} -->
		<!---->
		<!-- 						<td class="flex gap-2"> -->
		<!-- 							<span class="text-xs md:text-sm">{name}</span> -->
		<!-- 							{#if player.power_cards.find((card) => card.activated && !card.used)} -->
		<!-- 								<div> -->
		<!-- 									{#each player.power_cards as card, idx (idx)} -->
		<!-- 										{#if card.activated && !card.used} -->
		<!-- 											{@const words = card.name.split(' ')} -->
		<!-- 											<span class="uppercase"> -->
		<!-- 												{#each words as word, idx (idx)} -->
		<!-- 													{word[0]} -->
		<!-- 												{/each} -->
		<!-- 											</span> -->
		<!-- 										{/if} -->
		<!-- 									{/each} -->
		<!-- 								</div> -->
		<!-- 							{/if} -->
		<!-- 						</td> -->
		<!---->
		<!-- 						{#if idx < 1} -->
		<!-- 							<td> -->
		<!-- 								<span class="uppercase text-primary-500-400-token">vs</span> -->
		<!-- 							</td> -->
		<!-- 						{/if} -->
		<!-- 					{/each} -->
		<!---->
		<!-- 					<td class="w-44"> -->
		<!-- 						<p class="text-xs md:text-sm">{match.skill}</p> -->
		<!-- 					</td> -->
		<!-- 					<td class="w-44"> -->
		<!-- 						<p class="text-xs md:text-sm">{match.footwork}</p> -->
		<!-- 					</td> -->
		<!-- 				</tr> -->
		<!-- 			{/each} -->
		<!-- 		</tbody> -->
		<!-- 	</table> -->
		<!-- </div> -->
	</div>
</div>
