<script lang="ts">
	import { sectionsMap } from '$lib/data';
	import { db } from '$lib/firebase/firebase';
	import type { PendingMatch } from '$lib/types';
	import { addDoc, collection } from 'firebase/firestore';

	let pendingMatches: PendingMatch[] = [];

	// The one used for bind
	let sectionValue: string;

	// The one displayed
	// Stored in a new variable to avoid bind's reactive nature
	let selectedSection: string;

	let dataFetched = false;
	let loading = false;

	async function matchmake(event: SubmitEvent, section: string) {
		loading = true;
		selectedSection = section;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const response = await fetch('../api/matchmake', {
			method: 'POST',
			body: formData
		});

		if (!response) {
			loading = false;
			console.log('Not enough participants');
			return;
		}

		const data: { pendingMatches: PendingMatch[] } = await response.json();

		pendingMatches = data.pendingMatches;

		if (!pendingMatches) {
			loading = false;
			console.log('Not enough participants');
			return;
		}

		loading = false;
		dataFetched = true;
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<div class="flex h-3/4 min-h-min w-full flex-col items-center justify-center gap-4">
		{#if loading}
			<div>Loading...</div>
		{:else if !loading && dataFetched}
			<span
				class="font-gt-walsheim-pro-medium text-center text-3xl uppercase md:text-4xl xl:text-9xl"
				>match found</span
			>
			<span class="text-center text-lg">{sectionsMap.get(selectedSection)}</span>
			<div class="table-container max-w-5xl">
				<table class="table-compact table-hover table">
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
									<span class="text-primary-500-400-token uppercase">vs</span>
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
	<!-- I don't know if this is the best way for form actions + SvelteKit endpoint -->
	<div class="flex flex-col items-center gap-4">
		<form class="contents" on:submit|preventDefault={(e) => matchmake(e, sectionValue)}>
			<label class="label">
				<span>Section</span>
				<select class="input" size="1" name="section" required bind:value={sectionValue}>
					{#each sectionsMap as [key, value], idx (idx)}
						<option value={key}>{value}</option>
					{/each}
				</select>
			</label>
			<button class="variant-filled-primary rounded-md p-2">Matchmake</button>
		</form>
	</div>
</div>
