<script lang="ts">
	import { PowerCard } from '$lib/components';
	import { powerCardsMap, sectionsMap } from '$lib/data';
	import { auth, db, storage } from '$lib/firebase/firebase.js';
	import { currentUser, latestOpponent, selectedPowerCard } from '$lib/store.js';
	import type { Match, UserData } from '$lib/types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import {
		collection,
		doc,
		getDoc,
		onSnapshot,
		orderBy,
		query,
		updateDoc
	} from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	// import { arnis_bg } from '../assets/images';

	export let data;

	let selectedFile: File | null = null;
	let uploadInputEl: HTMLInputElement;

	$: user = getContext<Writable<UserData>>('user');
	$: opponent = getContext<Writable<UserData>>('opponent');

	$: pendingMatch = data?.latestPendingMatch;

	$: if (data.latestOpponent) {
		console.log('Opponent exists');
		latestOpponent.set(data.latestOpponent);
	}

	$: initials = $user.personal_data.name.first[0] + $user.personal_data.name.last[0];

	// Subscribe to pending match changes
	const pendingMatchesCollection = collection(
		db,
		`users/${data.user?.auth_data.uid}/pending_matches`
	);
	const q = query(pendingMatchesCollection, orderBy('timestamp', 'desc'));

	const unsubPendingMatch = onSnapshot(q, (snapshot) => {
		if (snapshot.empty) return;

		const newMatch = snapshot.docs.shift()?.data() as Match;
		const newOpponent = newMatch.players.find(
			(player) => player.auth_data.uid !== data.user?.auth_data.uid
		) as UserData;

		pendingMatch = newMatch;
		latestOpponent.set(newOpponent);

		console.log('Pending matches snapshot ran.');
	});

	// Subscribe to user changes
	const userRef = doc(db, 'users', data.user?.auth_data.uid || '');

	const unsubUser = onSnapshot(userRef, (snapshot) => {
		if (!snapshot.exists()) return;

		const updatedUserData = snapshot.data() as UserData;

		currentUser.update(
			(val) =>
				(val = {
					...val,
					...updatedUserData
				})
		);

		console.log('User snapshot ran.');
	});

	// Subscribe to opponent changes
	// Helps in checking if they've used power cards
	$: if (data.latestOpponent) {
		const opponentRef = doc(db, 'users', data.latestOpponent?.auth_data.uid || '');

		const unsubOpponent = onSnapshot(opponentRef, (snapshot) => {
			if (!snapshot.exists()) return;

			const updatedOpponentData = snapshot.data() as UserData;

			latestOpponent.update((val) => (val = updatedOpponentData));

			console.log('Opponent snapshot ran.');
		});

		onDestroy(() => unsubOpponent());
	}

	onDestroy(() => {
		unsubPendingMatch();
		unsubUser();
	});

	async function handleFileUpload() {
		if (!selectedFile) return;

		// Doesn't work???
		// const formData = new FormData();

		// formData.append('file', selectedFile);

		// const response = await fetch('./api/photo/upload', {
		// 	method: 'POST',
		// 	body: formData
		// });

		// if (response.ok) {
		// 	console.log('Successfully changed profile picture.');
		// } else {
		// 	console.error('Error changing profile picture.');
		// }

		const fileName = `${$user.auth_data.uid}_${selectedFile.name}`;
		const storageRef = ref(storage, `profilePictures/${fileName}`);

		try {
			const snapshot = await uploadBytes(storageRef, selectedFile);

			const downloadURL = await getDownloadURL(snapshot.ref);

			await updateProfilePicture(downloadURL, $user.auth_data.uid);

			console.log('Profile picture uploaded successfully!');
		} catch (error) {
			console.error('Error uploading profile picture: ', error);
		}
	}

	async function removePhoto() {
		if (!$user.auth_data.photo_url) return;

		const response = await fetch('./api/photo/remove', {
			method: 'POST'
		});

		if (response.ok) {
			console.log('Successfully removed profile picture.');
		} else {
			console.error('Error removing profile picture.');
		}
	}

	function handleSelectedFile(e: Event) {
		const target = e.currentTarget as HTMLInputElement;

		if (!target.files) return;

		selectedFile = target.files[0];

		handleFileUpload();
	}

	async function updateProfilePicture(downloadURL: string, userUID: string) {
		try {
			const userRef = doc(db, 'users', userUID);
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				await updateDoc(userRef, { 'auth_data.photo_url': downloadURL });
			}
		} catch (error) {
			console.error('Error updating profile picture: ', error);
		}
	}

	// TODO: Change selected image to .webp format and optimize resolution (if possible)
</script>

<!-- TODO: MAKE STUFF LOOK GOOD -->
<div class="flex h-full w-full flex-col items-center justify-center">
	{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
		<div class="flex flex-col items-center justify-center gap-10">
			<div class="flex flex-col items-center justify-center gap-4">
				<span class="text-4xl uppercase">(rank logo)</span>
				<span class="text-3xl uppercase">{$user.rank.title}</span>
				<Avatar src={$user.auth_data.photo_url || ''} width="w-20" {initials} />
				<button class="btn variant-ghost" on:click={() => uploadInputEl.click()}>
					Change photo
				</button>
				<button class="btn variant-ghost" on:click={removePhoto}>Remove photo</button>
				<input
					type="file"
					accept="image/*"
					on:change={handleSelectedFile}
					hidden
					bind:this={uploadInputEl}
				/>
				<div class="flex flex-col items-center">
					<span>
						{$user.personal_data.name.first}
						{$user.personal_data.name.last}
					</span>
					<span>
						{sectionsMap.get($user.personal_data.section)}
					</span>
				</div>
				<div class="flex gap-4">
					<div class="flex flex-col">
						<span>Overall Ranking:</span>
						<span class="text-secondary-700-200-token text-2xl">#{$user.rank.number.overall}</span>
					</div>
					<div class="flex flex-col">
						<span>Section Ranking:</span>
						<span class="text-secondary-700-200-token text-2xl">#{$user.rank.number.section}</span>
					</div>
				</div>
			</div>

			<div>
				{#if pendingMatch && $opponent}
					<ul class="max-h-[75vh] space-y-4 overflow-auto">
						<li class="flex flex-col items-start">
							<div class="flex flex-col items-center gap-4">
								<div class="flex flex-col items-center">
									<span>Upcoming match VS:</span>
									<span class="text-sm font-bold md:text-base">
										{$opponent.personal_data.name.first}
										{$opponent.personal_data.name.last}
									</span>
									{#if $opponent.power_cards}
										{#if $opponent.power_cards.find((card) => card.activated && !card.used)}
											<span>Opponent has activated:</span>
											{#each $opponent.power_cards as card, idx (idx)}
												{#if card.activated && !card.used}
													<span class="text-tertiary-300 font-bold">{card.name}</span>
												{/if}
											{/each}
										{:else}
											<span>No power cards used</span>
										{/if}
									{/if}
								</div>
								<div class="flex flex-col items-center">
									<div class="flex flex-col items-center">
										<span>Skill to perform:</span>
										<span class="text-tertiary-400">{pendingMatch.skill}</span>
									</div>
									<div class="flex flex-col items-center">
										<span>Footwork to perform:</span>
										<span class="text-tertiary-400">{pendingMatch.footwork}</span>
									</div>
								</div>
							</div>
						</li>
					</ul>
				{:else}
					<span class="flex w-full justify-center opacity-50">No upcoming match</span>
				{/if}
			</div>

			<!-- Put all power cards temporarily for dev purposes -->
			<!-- <div class="flex gap-2">
				{#each powerCardsMap as [key, value], idx (idx)}
					<button
						class="btn variant-filled-secondary"
						on:click={() => {
							selectedPowerCard.set(key);
						}}
					>
						{value.name}
					</button>
				{/each}
			</div> -->

			<!-- The power cards that the user has -->
			<div class="flex gap-2">
				{#each $user.power_cards as card, idx (idx)}
					<button
						class={`btn variant-filled-primary ${card.used ? 'opacity-50' : 'opacity-100'} ${
							card.activated && !card.used ? 'border-2 border-green-500' : 'border-none'
						}`}
						on:click={() => {
							selectedPowerCard.set(card.key);
						}}
					>
						{card.name}
					</button>
				{/each}
			</div>

			{#if $selectedPowerCard}
				<PowerCard />
			{/if}
		</div>
	{:else if $user.auth_data.is_logged_in && !$user.auth_data.is_registered}
		<div class="variant-filled-surface rounded-md p-4">
			<form method="post" action="?/register">
				<label class="label">
					<span>First Name</span>
					<input class="input" type="text" placeholder="eg. Ayaka" name="first-name" required />
				</label>

				<label class="label">
					<span>Last Name</span>
					<input class="input" type="text" placeholder="eg. Kamisato" name="last-name" required />
				</label>

				<label class="label">
					<span>Age</span>
					<input class="input" type="text" placeholder="eg. 18" name="age" required />
				</label>

				<label class="label">
					<span>Sex</span>
					<select class="input" size="1" value="male" name="sex" required>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</label>

				<label class="label">
					<span>Section</span>
					<select class="input" size="1" value="section-1" name="section" required>
						<option value="section-1">Section 1</option>
						<option value="section-2">Section 2</option>
						<option value="section-3">Section 3</option>
						<option value="section-4">Section 4</option>
						<option value="section-5">Section 5</option>
					</select>
				</label>

				<label class="label">
					<span>Email</span>
					<input
						class="input opacity-50"
						type="email"
						placeholder="Aa"
						name="email"
						value={`${$user.auth_data.email}`}
						readonly
					/>
				</label>

				<label class="label">
					<span>Contact No.</span>
					<input
						class="input"
						type="tel"
						placeholder="eg. 09123456789"
						name="contact-number"
						required
					/>
				</label>

				<button class="variant-filled-primary rounded-md p-2">Register</button>
			</form>
		</div>
	{:else if !$user.auth_data.is_logged_in && !$user.auth_data.is_registered}
		<div class="flex h-full w-full items-center">
			<!-- <img
				src={arnis_bg}
				class="hidden h-full w-full max-w-[50vw] object-cover object-[10%] lg:block"
				draggable="false"
				alt="arnis"
			/> -->
			<div class="flex h-full w-full flex-col items-center justify-center">
				<h1
					class="font-gt-walsheim-pro-medium mb-10 select-none text-center text-5xl uppercase md:text-7xl 2xl:text-9xl"
				>
					Kali Kalihim
				</h1>
				<div class="flex flex-col gap-4">
					<form class="contents" method="post" action="?/login">
						<div>
							<label class="label">
								<span>Email</span>
								<input class="input" type="email" name="email" required />
							</label>

							<label class="label">
								<span>Password</span>
								<input class="input" type="password" name="password" required />
							</label>
						</div>
						<button class="btn variant-filled-primary mx-auto flex">
							<span class="text-xl">Submit</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
