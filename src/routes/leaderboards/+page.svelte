<script lang="ts">
	import { sectionsMap } from '$lib/data';
	import { db } from '$lib/firebase/firebase';
	import type { UserData } from '$lib/types';
	import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;

	$: currentUser = getContext<Writable<UserData>>('user');

	let users = data.users;

	if (data.user?.auth_data.uid) {
		const usersCollection = collection(db, 'users');
		const q = query(usersCollection, orderBy('score', 'desc'));
		const unsubRank = onSnapshot(q, async (snapshot) => {
			users = snapshot.docs.map((user) => user.data() as UserData);

			console.log('Global leaderboards snapshot ran. (client)');
		});

		onDestroy(() => unsubRank());
	}
</script>

<div class="table-container max-w-5xl">
	<table class="table-compact table-hover table">
		<thead>
			<tr>
				<th class="text-sm md:text-base">Name</th>
				<th class="text-sm md:text-base">Section</th>
				<th class="text-sm md:text-base">Rating</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user, idx (idx)}
				<tr
					class={`${
						user.auth_data.uid === $currentUser.auth_data.uid
							? 'text-tertiary-600-300-token'
							: 'text-secondary-700-200-token'
					}`}
				>
					<td>
						<p class="text-xs md:text-sm">
							<span class="font-bold text-token">#{idx + 1}</span>
							<span>
								{user.personal_data.name.first}
								{user.personal_data.name.last}
							</span>
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm">
							{sectionsMap.get(user.personal_data.section)}
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm">
							{user.score}
							{user.rank.title}
						</p>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
