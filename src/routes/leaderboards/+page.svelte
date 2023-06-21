<script lang="ts">
	import { db } from '$lib/firebase/firebase.js';
	import type { UserData } from '$lib/types.js';
	import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;

	let users = data.users;

	$: currentUser = getContext<Writable<UserData>>('user');

	if (data.user?.auth_data.uid) {
		const usersCollection = collection(db, 'users');
		const q = query(usersCollection, orderBy('score', 'desc'));
		const unsubRank = onSnapshot(q, async (snapshot) => {
			snapshot.docs.map((user, index) => {
				console.log(user.data() as UserData)
			});
		});

		onDestroy(() => unsubRank())
	}
</script>

<div class="h-full w-full flex flex-col justify-center items-center">
	<div class="table-container max-w-5xl">
		<table class="table table-compact table-hover">
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
						<td>{user.personal_data.section}</td>
						<td>{user.score}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
