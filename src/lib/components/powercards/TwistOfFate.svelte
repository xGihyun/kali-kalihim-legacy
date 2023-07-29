<script lang="ts">
	import { getContext } from 'svelte';
	import { twistOfFate } from './functions';
	import type { UserData } from '$lib/types';
	import { collection, getDocs, query, where } from 'firebase/firestore';
	import type { Writable } from 'svelte/store';
	import { allUsersInSection } from '$lib/store';
	import { powerCardsMap } from '$lib/data';
	import { selectedPowerCard } from '$lib/store';
	import { db } from '$lib/firebase/firebase';

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

	$: powerCard = powerCardsMap.get($selectedPowerCard || '');

	function cancelPowerCard() {
		if (powerCard) {
			powerCard.used = false;
		}
		$selectedPowerCard = null;
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
	<div class="flex justify-end gap-4">
		<button class="btn variant-ghost-surface" type="button" on:click={cancelPowerCard}>
			Cancel
		</button>
		<button class="btn variant-filled-primary" type="button" on:click={handleClick}>Submit</button>
	</div>
{:else}
	<p>Successfully used Twist of Fate</p>
	<div class="flex justify-end gap-4">
		<button
			class="btn variant-ghost-surface"
			type="button"
			on:click={() => ($selectedPowerCard = null)}
		>
			Cancel
		</button>
	</div>
{/if}
