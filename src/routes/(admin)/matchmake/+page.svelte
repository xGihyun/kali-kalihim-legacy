<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import type { UserData } from '$lib/types';
	import { addDoc, collection } from 'firebase/firestore';

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
			console.log('Not enough participants')
			return;
		}

		const data: UserData[] = await response.json();

		users = data;

		getRandomArnisSkill();

		loading = false;
		dataFetched = true;

		addMatchHistory(users);
	}

	function addMatchHistory(users: UserData[]) {
		const currentDate = new Date();

		const matchHistoryData = {
			players: [...users],
			timestamp: currentDate
		};

		users.forEach(async (user) => {
			const matchHistoryCollection = collection(db, `users/${user.auth_data.uid}/match_history`);

			await addDoc(matchHistoryCollection, matchHistoryData);
		});

		// console.log(matchHistoryData)
		// console.log(data);
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
		{/if}
	</div>
	<button class="variant-filled-primary rounded-md p-2" on:click={fetchRandomUsers}
		>Find Match</button
	>
</div>
