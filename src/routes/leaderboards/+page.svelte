<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import type { UserData } from '$lib/types';
	import { formatSection } from '$lib/utils/functions.js';
	import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	export let data;

	$: currentUser = data.user;
	$: users = data.users;

	if (data.user?.auth_data.uid) {
		const usersCollection = collection(db, 'users');
		const q = query(usersCollection, orderBy('score', 'desc'));
		const unsubRank = onSnapshot(q, async (snapshot) => {
			users = snapshot.docs.map((user) => user.data() as UserData);
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
				<th class="text-sm md:text-base text-center">Rating</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user, idx (idx)}
				<tr
					class={`${
						user.auth_data.uid === currentUser?.auth_data.uid
							? 'text-tertiary-600-300-token'
							: 'text-secondary-700-200-token'
					}`}
				>
					<td>
						<p class="text-xs md:text-sm">
							<span class="text-token font-bold">#{idx + 1}</span>
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
							St. {formatSection(user.personal_data.section)}
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
