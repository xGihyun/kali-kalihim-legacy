<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import type { UserData } from '$lib/types';
	import { formatSection } from '$lib/utils/functions.js';
	import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;

	$: ({ users } = data);

	const currentUser = getContext<Writable<UserData>>('user');

	$: {
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
			{#each users as user, idx (user.auth_data.uid)}
				{@const name = `${user.personal_data.name.first} ${user.personal_data.name.last}`}
				{@const section = `St. ${formatSection(user.personal_data.section)}`}
				{@const { score } = user}
				{@const rank = `#${idx + 1}`}

				<tr
					class={`${
						user.auth_data.uid === $currentUser.auth_data.uid
							? 'text-tertiary-600-300-token'
							: 'text-secondary-700-200-token'
					}`}
				>
					<td>
						<p class="text-xs md:text-sm">
							<span class="text-token font-bold">{rank}</span>
							<a class="hover:underline" href={`/users/${user.auth_data.uid}`}>
								<span>
									{name}
								</span>
							</a>
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm">
							{section}
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm text-center">
							{score}
						</p>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
