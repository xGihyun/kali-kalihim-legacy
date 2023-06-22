<script lang="ts">
	import { db } from '$lib/firebase/firebase.js';
	import type { UserData } from '$lib/types.js';
	import { updateRank } from '$lib/utils/update.js';
	import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;

	let users = data.users;

	$: currentUser = getContext<Writable<UserData>>('user');

	if (data.user?.auth_data.uid) {
		const usersCollection = collection(db, 'users');
		const q = query(usersCollection, orderBy('score', 'desc'));
		const unsubRank = onSnapshot(q, async (snapshot) => {
			const updatedUsers = await Promise.all(
				snapshot.docs.map(async (user, index) => {
					const userRef = doc(db, 'users', user.id);
					await updateDoc(userRef, { 'rank.number': index + 1 });

					await updateRank(userRef);

					return user.data() as UserData;
				})
			);

			users = updatedUsers;

			console.log('Leaderboards snapshot ran.');
		});

		onDestroy(() => unsubRank());
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<div class="table-container max-w-5xl">
		<table class="table-compact table-hover table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Section</th>
					<th>Rating</th>
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
						<td
							><span class="font-bold text-white">#{idx + 1}</span>
							<span>
								{user.personal_data.name.first}
								{user.personal_data.name.last}
								<span /></span
							></td
						>
						<td class="w-1/4">{user.personal_data.section}</td>
						<td class="w-1/4">{user.score} {user.rank.title}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
