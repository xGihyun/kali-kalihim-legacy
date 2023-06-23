<script lang="ts">
	import { sectionMap } from '$lib/data.js';
	import { db } from '$lib/firebase/firebase.js';
	import type { UserData } from '$lib/types.js';
	import { updateRank } from '$lib/utils/update.js';
	import {
		collection,
		doc,
		onSnapshot,
		query,
		updateDoc,
		where,
		writeBatch
	} from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;

	let users = data.users;
	let section = data.section;

	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', section));
	const unsubRank = onSnapshot(q, async (snapshot) => {
		const batch = writeBatch(db);
		// Get the snapshots, and sort it before updating the rankings
		const sortedUsersSnapshot = snapshot.docs
			.map((user) => user.data() as UserData)
			.sort((a, b) => b.score - a.score);

		// Update the rankings when it changes
		const updatedUsers = await Promise.all(
			sortedUsersSnapshot.map(async (user, index) => {
				const userRef = doc(db, 'users', user.auth_data.uid || '');

				batch.update(userRef, { 'rank.number': index + 1 });
				// await updateDoc(userRef, { 'rank.number': index + 1 });
				await updateRank(userRef);

				console.log('leaderboards/[section] snapshot: ' + user.auth_data.uid);

				return user;
			})
		);

		await batch.commit();

		users = updatedUsers;

		console.log('Section leaderboards snapshot ran. (client)');
	});

	onDestroy(() => unsubRank());

	$: currentUser = getContext<Writable<UserData>>('user');
</script>

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
					<td class="w-1/4">{sectionMap.get(user.personal_data.section)}</td>
					<td class="w-1/4">{user.score} {user.rank.title}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
