<script lang="ts">
	import { sectionsMap } from '$lib/data';
	import { db } from '$lib/firebase/firebase';
	import type { PendingMatch } from '$lib/types';
	import { addDoc, collection } from 'firebase/firestore';

	let pendingMatches: PendingMatch[] = [];
	let section: string;
	let dataFetched = false;
	let loading = false;

	async function matchmake(event: SubmitEvent) {
		loading = true;

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

		const data: { section: string; pendingMatches: PendingMatch[]; matchSetId: string } =
			await response.json();

		section = data.section;
		pendingMatches = data.pendingMatches;

		if (!pendingMatches) {
			loading = false;
			console.log('Not enough participants');
			return;
		}

		loading = false;
		dataFetched = true;

		// Add pending match to their notifications
		pendingMatches.forEach((users) => addPendingMatch(users, section, data.matchSetId));
	}

	async function addPendingMatch(users: PendingMatch, section: string, id: string) {
		const matchData: PendingMatch = {
			players: [...users.players],
			section,
			skill: users.skill,
			footwork: users.footwork,
			timestamp: users.timestamp
		};

		const playerUids = users.players.map((user) => user.auth_data.uid);

		const matchesCollection = collection(db, `match_sets/${id}/matches`);
		await addDoc(matchesCollection, { ...matchData, uids: playerUids });

		users.players.forEach(async (user) => {
			const userPendingMatchCollection = collection(
				db,
				`users/${user.auth_data.uid}/pending_matches`
			);
			await addDoc(userPendingMatchCollection, matchData);
		});
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
			<span class="text-center text-lg">{sectionsMap.get(section)}</span>
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
		<form class="contents" on:submit|preventDefault={matchmake}>
			<label class="label">
				<span>Section</span>
				<select class="input" size="1" name="section" required>
					{#each sectionsMap as [key, value], idx (idx)}
						<option value={key}>{value}</option>
					{/each}
				</select>
			</label>
			<button class="variant-filled-primary rounded-md p-2">Matchmake</button>
		</form>
	</div>
</div>
