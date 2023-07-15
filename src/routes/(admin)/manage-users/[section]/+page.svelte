<script lang="ts">
	import { db } from '$lib/firebase/firebase.js';
	import type { UserData } from '$lib/types.js';
	import { collection, onSnapshot, query, where } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;

	$: maleUsers = data.users.male;
	$: femaleUsers = data.users.female;

	$: sectionsMap = getContext<Writable<Map<string, string>>>('sections');

	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', data.section));

	const unsubMale = onSnapshot(q, (snapshot) => {
		const users = snapshot.docs
			.map((user) => user.data() as UserData)
			.filter((user) => user.personal_data.sex === 'male')
			.sort((a, b) => {
				const nameA = `${a.personal_data.name.first} ${a.personal_data.name.last}`;
				const nameB = `${b.personal_data.name.first} ${b.personal_data.name.last}`;

				return nameA.localeCompare(nameB);
			});

		maleUsers = users;
	});

	const unsubFemale = onSnapshot(q, (snapshot) => {
		const users = snapshot.docs
			.map((user) => user.data() as UserData)
			.filter((user) => user.personal_data.sex === 'female')
			.sort((a, b) => {
				const nameA = `${a.personal_data.name.first} ${a.personal_data.name.last}`;
				const nameB = `${b.personal_data.name.first} ${b.personal_data.name.last}`;

				return nameA.localeCompare(nameB);
			});

		femaleUsers = users;
	});

	onDestroy(() => {
		unsubMale();
		unsubFemale();
	});
</script>

<!-- Male -->
<div class="table-container max-w-5xl">
	<h2 class="w-full text-center text-base uppercase text-secondary-700-200-token opacity-75">Male</h2>
	<table class="table-hover table-compact table">
		<thead>
			<tr>
				<th class="text-sm md:text-base">Name</th>
				<th class="text-sm md:text-base">Section</th>
				<th class="text-sm md:text-base text-center">Rating</th>
			</tr>
		</thead>
		<tbody>
			{#each maleUsers as user (user.auth_data.uid)}
				<tr class="text-secondary-700-200-token">
					<td>
						<p class="text-xs md:text-sm">
							<!-- <span class="text-token font-bold">#{idx + 1}</span> -->
							<a class="hover:underline" href={`/users/${user.auth_data.uid}`}>
								<span>
									{user.personal_data.name.first}
									{user.personal_data.name.last}
								</span>
							</a>
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm">
							St. {$sectionsMap.get(user.personal_data.section)}
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm text-center">
							{user.score}
						</p>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Female -->
<div class="table-container max-w-5xl">
	<h2 class="w-full text-center text-base uppercase text-secondary-700-200-token opacity-75">Female</h2>
	<table class="table-hover table-compact table">
		<thead>
			<tr>
				<th class="text-sm md:text-base">Name</th>
				<th class="text-sm md:text-base">Section</th>
				<th class="text-sm md:text-base text-center">Rating</th>
			</tr>
		</thead>
		<tbody>
			{#each femaleUsers as user (user.auth_data.uid)}
				<tr class="text-secondary-700-200-token">
					<td>
						<p class="text-xs md:text-sm">
							<!-- <span class="text-token font-bold">#{idx + 1}</span> -->
							<a class="hover:underline" href={`/users/${user.auth_data.uid}`}>
								<span>
									{user.personal_data.name.first}
									{user.personal_data.name.last}
								</span>
							</a>
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm">
							St. {$sectionsMap.get(user.personal_data.section)}
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm text-center">
							{user.score}
						</p>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
