<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Match } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	$: sectionsMap = getContext<Writable<Map<string, string>>>('sections');

	let pendingMatches: Match[] = [];
	let sectionValue: string;

	// Stored in a new variable to avoid bind's reactive nature
	let selectedSection: string;

	let dataFetched = false;
	let loading = false;

	function matchmake(data: Record<string, unknown> | undefined) {
		const response: Record<string, string> = data as Record<string, string>;

		const values = Object.values(response)[0];
		const matches = JSON.parse(values) as Match[];

		pendingMatches = matches;
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
			<span class="text-center text-lg">{$sectionsMap.get(selectedSection)}</span>
			<div class="table-container max-w-5xl">
				<table class="table-hover table-compact table">
					<thead>
						<tr class="text-sm md:text-base">
							<th>Player 1</th>
							<th>VS</th>
							<th>Player 2</th>
							<th>Skill</th>
							<th>Footwork</th>
						</tr>
					</thead>
					{#each pendingMatches as match, idx (idx)}
						<tbody>
							<tr>
								<td>
									<p class="text-xs md:text-sm">
										{match.players[0].personal_data.name.first}
										{match.players[0].personal_data.name.last}
									</p>
								</td>
								<td>
									<span class="uppercase text-primary-500-400-token">vs</span>
								</td>
								<td>
									<p class="text-xs md:text-sm">
										{match.players[1].personal_data.name.first}
										{match.players[1].personal_data.name.last}
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
						console.error("Something went wrong, check if there's enough number of participants");
						loading = false;
					}
				};
			}}
		>
			<label class="label">
				<span>Section</span>
				<select class="select" name="section" required bind:value={sectionValue}>
					{#each $sectionsMap as [key, value], idx (idx)}
						<option value={key}>{value}</option>
					{/each}
				</select>
			</label>
			<button class="btn variant-filled-primary" type="submit">Matchmake</button>
		</form>
	</div>
</div>
