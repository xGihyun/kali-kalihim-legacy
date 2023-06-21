<script lang="ts">
	import { db } from '$lib/firebase/firebase.js';
	import type { UserData } from '$lib/types.js';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';

	export let data;

	const section = data.section;
	const matches = data.matches;
	let clickedRow: number | null = null;

	function toggleRow(idx: number) {
		clickedRow = clickedRow === idx ? null : idx;
	}

	function addToMatchHistory(users: UserData[]) {
		const currentDate = new Date();

		const matchHistoryData = {
			players: [...users],
			timestamp: Timestamp.fromDate(currentDate)
		};

		users.forEach(async (user) => {
			const matchHistoryCollection = collection(db, `users/${user.auth_data.uid}/match_history`);

			await addDoc(matchHistoryCollection, matchHistoryData);
		});
	}

	async function handleSubmit(event: SubmitEvent, users: UserData[]) {
		const form = event?.target as HTMLFormElement;
		const formData = new FormData(form);
		const response = await fetch('../../../api/submit-score', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			console.log('Scores submitted successfully!');
			form.reset();
			addToMatchHistory(users);
		} else {
			console.error('Error submitting form: ', response.statusText);
		}
	}
</script>

<div class="h-full w-full flex flex-col justify-center items-center">
	<span class="text-center text-lg">{section}</span>
	<div class="table-container max-w-5xl">
		<table class="table table-interactive table-compact table-hover">
			<thead>
				<tr class="text-sm md:text-base">
					<th>Player 1</th>
					<th>VS</th>
					<th>Player 2</th>
					<th>Skill</th>
					<th>Footwork</th>
				</tr>
			</thead>
			{#each matches as match, idx (idx)}
				<tbody>
					<tr on:click={() => toggleRow(idx)}>
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

				<!-- Modal -->
				{#if clickedRow === idx}
					<div class="bg-surface-backdrop-token fixed top-0 left-0 w-full h-full z-[999]">
						<div class="h-full w-full flex items-center justify-center">
							<div
								class="bg-surface-100-800-token rounded-container-token w-modal shadow-xl p-4 space-y-4"
							>
								<form
									class="contents"
									on:submit|preventDefault={(e) => handleSubmit(e, match.players)}
								>
									<div>
										{#each match.players as user, idx (idx)}
											<label class="label">
												<span
													>Score for {user.personal_data.name.first}
													{user.personal_data.name.last}</span
												>
												<input
													class="input"
													type="text"
													name={`score-${user.auth_data.uid}`}
													required
												/>
											</label>
										{/each}
									</div>
									<button class="btn variant-ghost-surface" on:click={() => (clickedRow = null)}
										>Close</button
									>
									<button class="variant-filled-primary btn">Submit</button>
								</form>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</table>
	</div>
</div>
