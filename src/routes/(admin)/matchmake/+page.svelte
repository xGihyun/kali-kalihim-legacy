<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Match } from '$lib/types';
	import { formatSection } from '$lib/utils/functions';

	export let data;

	$: ({ matchSet, sections } = data);

	let newMatches: Match[] = [];
	let sectionValue: string;

	// Stored in a new variable to avoid bind's reactive nature
	let selectedSection: string;

	let dataFetched = false;
	let loading = false;

	function matchmake(data: Record<string, unknown> | undefined): void {
		try {
			if (!data) {
				throw new Error('No data in matchmake function.');
			}

			const response = data as Record<string, string>;
			const values = Object.values(response)[0];
			const matches = JSON.parse(values) as Match[];

			newMatches = matches;

			if (matchSet) {
				matchSet = { ...matchSet, timer_expired: false };
			}
		} catch (error) {
			console.error('Error in match making: ' + error);
		}
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<div class="flex h-3/4 min-h-min w-full flex-col items-center justify-center gap-4">
		{#if loading}
			<div>Loading...</div>
		{:else if !loading && dataFetched}
			<span
				class="text-center font-gt-walsheim-pro-medium text-3xl uppercase md:text-4xl xl:text-9xl"
			>
				match found
			</span>
			<span class="text-center text-lg">{formatSection(selectedSection)}</span>
			<div class="table-container max-w-5xl">
				<table class="table table-hover table-compact">
					<thead>
						<tr class="text-sm md:text-base">
							<th>Player 1</th>
							<th>VS</th>
							<th>Player 2</th>
							<th>Skill</th>
							<th>Footwork</th>
						</tr>
					</thead>
					{#each newMatches as match, idx (idx)}
						{@const player1 = match.players[0]}
						{@const player2 = match.players[1]}
						<tbody>
							<tr>
								<td>
									<p class="text-xs md:text-sm">
										{player1.personal_data.name.first}
										{player1.personal_data.name.last}
									</p>
								</td>
								<td>
									<span class="text-primary-500-400-token uppercase">vs</span>
								</td>
								<td>
									<p class="text-xs md:text-sm">
										{player2.personal_data.name.first}
										{player2.personal_data.name.last}
									</p>
								</td>
								<td>
									<p class="text-xs md:text-sm">{match.skill}</p>
								</td>
								<td>
									<p class="text-xs md:text-sm">{match.footwork}</p>
								</td>
							</tr>
						</tbody>
					{/each}
				</table>
			</div>
		{/if}
	</div>
	<div class="flex flex-col items-center gap-4">
		<form
			class="contents"
			method="post"
			use:enhance={() => {
				loading = true;
				selectedSection = sectionValue;

				return async ({ result }) => {
					if (result.type === 'success') {
						console.log('Match made');

						matchmake(result.data);

						loading = false;
						dataFetched = true;
					} else {
						loading = false;
						throw new Error(
							"Something went wrong, check if there's enough number of participants."
						);
					}
				};
			}}
		>
			<label class="label">
				<span>Section</span>
				<select class="select" name="section" required bind:value={sectionValue}>
					{#each sections as section, idx (idx)}
						<option value={section.id}>{section.name}</option>
					{/each}
				</select>
			</label>
			<button class="btn variant-filled-primary" type="submit">Matchmake</button>
		</form>
	</div>
</div>
