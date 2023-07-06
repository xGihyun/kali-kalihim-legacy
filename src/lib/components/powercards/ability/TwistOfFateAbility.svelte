<script lang="ts">
	import { getContext } from 'svelte';
	import { twistOfFate } from './functions';
	import type { UserData } from '$lib/types';
	import { collection, getDocs, query, where } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import type { Writable } from 'svelte/store';
	import { allUsersInSection } from '$lib/store';

	const usersInSection = getContext<Writable<UserData[]>>('usersInSection');
	const user = getContext<Writable<UserData>>('user');
	const opponent = getContext<Writable<UserData>>('opponent');

	let selectedOpponent: UserData;
	let used = false;

	$: {
		if ($usersInSection.length === 0) {
			getAllUsers();
		}
	}

	async function getAllUsers() {
		const allUsersCollection = collection(db, 'users');
		const q = query(
			allUsersCollection,
			where('personal_data.section', '==', $user.personal_data.section)
		);
		const allUsersInSectionDocs = await getDocs(q);
		const allUsers = allUsersInSectionDocs.docs
			.map((user) => user.data() as UserData)
			.filter(
				(userData) =>
					userData.auth_data.uid !== $user.auth_data.uid &&
					userData.auth_data.uid !== $opponent.auth_data.uid
			);

		allUsersInSection.set(allUsers);
	}

	function handleClick() {
		twistOfFate($user, $opponent, selectedOpponent);
		used = true;
	}
</script>

{#if !used}
	<span>Choose an opponent:</span>
	{#if $usersInSection.length === 0}
		<div class="flex justify-center">
			<span>Loading users...</span>
		</div>
	{:else}
		<label class="label">
			<select class="input" size="1" name="opponent" required bind:value={selectedOpponent}>
				{#each $usersInSection as user, idx (idx)}
					<span>{user.personal_data.name.first} {user.personal_data.name.last}</span>
					<option value={user}>
						{user.personal_data.name.first}
						{user.personal_data.name.last}
					</option>
				{/each}
			</select>
		</label>
	{/if}
	<button class="btn variant-filled-primary" type="button" on:click={handleClick}>Submit</button>
{:else}
	<p>Successfully used Twist of Fate</p>
{/if}
