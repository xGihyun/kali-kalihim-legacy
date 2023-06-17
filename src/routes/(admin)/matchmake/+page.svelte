<script lang="ts">
	import { enhance } from '$app/forms';
	import { db } from '$lib/firebase/firebase';
	import type { UserData } from '$lib/types';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';

	let skillToPerform = '';
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

		skillToPerform = randomSkill;
	}

	let users: UserData[] = [];
	let loading = false;

	async function fetchRandomUsers() {
		loading = true;
		const response = await fetch('../api/matchmake');

		if (!response) {
			loading = false;
			console.log('Not enough participants');
			return;
		}

		const data: UserData[] = await response.json();

		users = data;

		getRandomArnisSkill();

		loading = false;
		dataFetched = true;

		// Add pending match to their notifications
		addPendingMatch(users);
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

		// console.log(matchHistoryData)
		// console.log(data);
	}

	async function handleSubmit(event: SubmitEvent) {
		const form = event.target as HTMLFormElement;
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

<div class="h-full w-full flex flex-col justify-center items-center">
	<div class="flex flex-col gap-4 justify-center items-center min-h-min h-3/4">
		{#if loading}
			<div>Loading...</div>
		{:else if !loading && dataFetched}
			<span class="uppercase text-9xl font-gt-walsheim-pro-medium">match found</span>
			<!-- {#each users as user, idx (idx)}
				<p>{user.personal_data.name.first} {user.personal_data.name.last}</p>
			{/each} -->
			<div class="flex gap-2 text-end">
				<p class="text-3xl">
					{users[0].personal_data.name.first}
					{users[0].personal_data.name.last}
				</p>
				<span class="uppercase font-gt-walsheim-pro-medium text-3xl">vs</span>
				<p class="text-3xl">
					{users[1].personal_data.name.first}
					{users[1].personal_data.name.last}
				</p>
			</div>
			<span>Skill to perform: {skillToPerform}</span>
			<div class="flex flex-col gap-4">
				<form class="contents" on:submit|preventDefault={handleSubmit}>
					<div>
						{#each users as user, idx (idx)}
							<label class="label">
								<span>Score for {user.personal_data.name.first} {user.personal_data.name.last}</span
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
					<button class="mx-auto variant-filled-primary rounded-md p-2">Submit</button>
				</form>
			</div>
		{/if}

		<!-- FOR TESTING PURPOSES -->
		<!-- <span class="uppercase text-9xl font-gt-walsheim-pro-medium">match found</span>
		<div class="flex gap-2 text-end">
			<p class="text-3xl">First Last</p>
			<span class="uppercase font-gt-walsheim-pro-medium text-3xl">vs</span>
			<p class="text-3xl">First Last</p>
		</div>
		<span>Skill to perform: Skill</span>
		<div class="flex flex-col gap-4">
			<label class="label">
				<span>Score for (name)</span>
				<input class="input" type="text" placeholder="Score" name="score" required />
			</label>
			<label class="label">
				<span>Score for (name)</span>
				<input class="input" type="text" placeholder="Score" name="score" required />
			</label>
		</div> -->
	</div>
	<button class="variant-filled-primary rounded-md p-2" on:click={fetchRandomUsers}
		>Find Match</button
	>
</div>
