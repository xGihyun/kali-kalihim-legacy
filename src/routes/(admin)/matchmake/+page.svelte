<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import type { UserData } from '$lib/types';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';

	let dataFetched = false;

	function getRandomArnisSkill() {
		const skills = [
			'Strikes',
			'Blocks',
			'Forward Sinawali',
			'Sideward Sinawali',
			'Reversed Sinawali',
			'Guerrero',
			'Cabellero',
			'Triangle',
			'Reversed Triangle'
		];
		// const footworks = ['Guerrero', 'Cabellero', 'Triangle', 'Reversed Triangle'];

		const randomSkillIndex = Math.floor(Math.random() * skills.length);
		// const randomFootworkIndex = Math.floor(Math.random() * footworks.length);

		const randomSkill = skills[randomSkillIndex];
		// const randomFootwork = skills[randomFootworkIndex];

		return randomSkill;
	}

	let pairedUsers: UserData[][] = [];
	let section: string;
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

		const data: { section: string; pairedUsers: UserData[][] } = await response.json();

		section = data.section;
		pairedUsers = data.pairedUsers;

		if (!pairedUsers) {
			loading = false;
			console.log('Not enough participants');
			return;
		}

		loading = false;
		dataFetched = true;

		// Add pending match to their notifications
		pairedUsers.forEach((users) => addPendingMatch(users));
	}

	function addPendingMatch(users: UserData[]) {
		const currentDate = new Date();

		const pendingMatchData = {
			players: [...users],
			timestamp: Timestamp.fromDate(currentDate)
		};

		users.forEach(async (user) => {
			const pendingMatchCollection = collection(db, `users/${user.auth_data.uid}/pending_matches`);

			await addDoc(pendingMatchCollection, pendingMatchData);
		});
	}

	function addMatchHistory(users: UserData[]) {
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
		const response = await fetch('/api/submit-score', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			console.log('Scores submitted successfully!');
			form.reset();
			addMatchHistory(users);
		} else {
			console.error('Error submitting form: ', response.statusText);
		}
	}
</script>

<div class="h-full w-full flex flex-col justify-center items-center px-[5%]">
	<div class="flex flex-col gap-4 justify-center items-center min-h-min h-3/4">
		{#if loading}
			<div>Loading...</div>
		{:else if !loading && dataFetched}
			<span
				class="uppercase text-center text-3xl md:text-4xl xl:text-9xl font-gt-walsheim-pro-medium"
				>match found</span
			>
			<span class="text-center text-lg">{section}</span>
			<div class="table-container max-w-5xl">
				<table class="table table-compact table-hover">
					<thead>
						<tr>
							<th>Player 1</th>
							<th>VS</th>
							<th>Player 2</th>
							<th>Skill to Perform</th>
							<!-- <th>Rating</th> -->
						</tr>
					</thead>
					{#each pairedUsers as users, idx (idx)}
						<tbody>
							<tr>
								<td>
									<span>
										{users[0].personal_data.name.first}
										{users[0].personal_data.name.last}
									</span>
								</td>
								<td>
									<span class="text-primary-500-400-token uppercase">vs</span>
								</td>
								<td>
									<span>
										{users[1].personal_data.name.first}
										{users[1].personal_data.name.last}
									</span>
								</td>
								<td>{getRandomArnisSkill()}</td>
								<!-- <td>{user.score}</td> -->
							</tr>
						</tbody>

						<!-- <div class="flex flex-col gap-4">
							<form class="contents" on:submit|preventDefault={(e) => handleSubmit(e, users)}>
								<div>
									{#each users as user, idx (idx)}
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
								<button class="mx-auto variant-filled-secondary rounded-md p-2">Submit</button>
							</form>
						</div> -->
					{/each}
				</table>
			</div>
		{/if}
	</div>
	<!-- I don't know if this is the best way for form actions + SvelteKit endpoint -->
	<div class="flex-col items-center flex gap-4">
		<form class="contents" on:submit|preventDefault={matchmake}>
			<label class="label">
				<span>Section</span>
				<select class="input" size="1" name="section" required>
					<option value="section-1">Section 1</option>
					<option value="section-2">Section 2</option>
					<option value="section-3">Section 3</option>
					<option value="section-4">Section 4</option>
					<option value="section-5">Section 5</option>
				</select>
			</label>
			<button class="variant-filled-primary rounded-md p-2">Find Match</button>
		</form>
	</div>
</div>
