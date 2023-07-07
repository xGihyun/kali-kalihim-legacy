<script lang="ts">
	import { PowerCard } from '$lib/components';
	import { powerCardsMap, sectionsMap } from '$lib/data';
	import { db } from '$lib/firebase/firebase';
	import { currentUser, latestOpponent, selectedPowerCard } from '$lib/store';
	import type { Match, UserData } from '$lib/types';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Edit } from '../assets/icons';
	import { crop } from '$lib/pkg/my_package';

	export let data;

	let selectedAvatar: File | null = null;
	let selectedBanner: File | null = null;
	let uploadAvatarEl: HTMLInputElement;
	let uploadBannerEl: HTMLInputElement;
	let initials: string = '';
	let opponentInitials: string = '';

	const BANNER = {
		width: 1920,
		height: 320
	};

	const AVATAR = {
		width: 160,
		height: 160
	};

	$: user = getContext<Writable<UserData>>('user');
	$: opponent = getContext<Writable<UserData>>('opponent');

	$: pendingMatch = data?.latestPendingMatch;

	// Subscribe to user changes
	$: if (data.user) {
		initials = `${data.user.personal_data.name.first[0]}${data.user.personal_data.name.last[0]}`;

		const userRef = doc(db, 'users', data.user.auth_data.uid);

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

			// console.log('User snapshot ran.');
		});

		// Upcoming match
		const pendingMatchesCollection = collection(
			db,
			`users/${data.user.auth_data.uid}/pending_matches`
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

			// console.log('Pending matches snapshot ran.');
		});

		onDestroy(() => {
			unsubUser();
			unsubPendingMatch();
		});
	}

	// Subscribe to opponent changes
	// Helps in checking if they've used power cards
	$: if (data.latestOpponent) {
		opponentInitials = `${data.latestOpponent.personal_data.name.first[0]}${data.latestOpponent.personal_data.name.last[0]}`;

		// console.log('Opponent exists');
		// latestOpponent.set(data.latestOpponent);

		const opponentRef = doc(db, 'users', data.latestOpponent.auth_data.uid);

		const unsubOpponent = onSnapshot(opponentRef, (snapshot) => {
			if (!snapshot.exists()) return;

			const updatedOpponentData = snapshot.data() as UserData;

			latestOpponent.update((val) => (val = updatedOpponentData));

			// console.log('Opponent snapshot ran.');
		});

		onDestroy(() => unsubOpponent());
	}

	// Profile picture
	const popupChangeAvatar: PopupSettings = {
		event: 'click',
		target: 'avatar',
		placement: 'bottom'
	};

	async function handleFileUpload() {
		if (!selectedAvatar) return;

		const formData = new FormData();

		const bannerArrayBuffer = await selectedAvatar.arrayBuffer();
		const bannerBytes = new Uint8Array(bannerArrayBuffer);
		const croppedBannerBytes = crop(bannerBytes, AVATAR.width, AVATAR.height);

		formData.append('blob', new Blob([croppedBannerBytes]));
		formData.append('file_name', selectedAvatar.name);

		const response = await fetch('./api/photo/upload', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			console.log('Successfully changed profile picture.');
		} else {
			console.error('Error changing profile picture.');
		}
	}

	async function removeAvatar() {
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

	function handleSelectedAvatar(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) return;

		selectedAvatar = target.files[0];

		handleFileUpload();
	}

	// Banner
	const popupChangeBanner: PopupSettings = {
		event: 'click',
		target: 'banner',
		placement: 'bottom'
	};

	async function handleBannerUpload() {
		if (!selectedBanner) return;

		const formData = new FormData();

		const bannerArrayBuffer = await selectedBanner.arrayBuffer();
		const bannerBytes = new Uint8Array(bannerArrayBuffer);
		const croppedBannerBytes = crop(bannerBytes, BANNER.width, BANNER.height);

		formData.append('blob', new Blob([croppedBannerBytes]));
		formData.append('file_name', selectedBanner.name);

		const response = await fetch('./api/banner/upload', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			console.log('Successfully changed banner.');
		} else {
			console.error('Error changing banner.');
		}
	}

	function handleSelectedBanner(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) return;

		selectedBanner = target.files[0];

		handleBannerUpload();
	}

	async function removeBanner() {
		if (!$user.auth_data.photo_url) return;

		const response = await fetch('./api/banner/remove', {
			method: 'POST'
		});

		if (response.ok) {
			console.log('Successfully removed banner.');
		} else {
			console.error('Error removing banner.');
		}
	}

	// TODO: Add cropping with preview?
</script>

<!-- TODO: MAKE STUFF LOOK GOOD -->
<div class="flex h-full w-full flex-col items-center justify-center">
	{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
		<!-- Banner -->
		<!-- TODO: Optimize images -->
		<div class="relative h-80 w-full">
			{#if $user.auth_data.banner_url}
				<img
					class="h-80 w-full object-cover object-center"
					src={$user.auth_data.banner_url}
					alt="banner"
				/>
			{:else}
				<div class="bg-surface-300-600-token h-80" />
			{/if}
			<button
				class="bg-surface-300-600-token hover:bg-surface-500-400-token absolute bottom-2 right-5 rounded-full p-2 transition-[background-color] duration-100"
				use:popup={popupChangeBanner}
			>
				<Edit styles="w-5 h-5" />
			</button>
			<div class="card z-20 w-40 py-2 shadow-xl transition-none duration-0" data-popup="banner">
				<input
					type="file"
					accept="image/*"
					name="banner"
					hidden
					on:change={handleSelectedBanner}
					bind:this={uploadBannerEl}
				/>
				<button
					class="hover:bg-surface-400-500-token w-full px-2 py-1"
					on:click={() => uploadBannerEl.click()}
				>
					Change banner
				</button>
				<button class="hover:bg-surface-400-500-token w-full px-2 py-1" on:click={removeBanner}>
					Remove banner
				</button>
				<div class="arrow bg-surface-100-800-token" />
			</div>
		</div>
		<div class="bg-surface-200-700-token flex h-32 w-full gap-4 px-[5%]">
			<button
				class="shadow-profile mb-10 flex-none self-end rounded-full"
				title="Change your avatar!"
				use:popup={popupChangeAvatar}
			>
				<Avatar src={$user.auth_data.photo_url || ''} width="w-40" {initials} />
			</button>
			<div class="card z-20 w-40 py-2 shadow-xl transition-none duration-0" data-popup="avatar">
				<button
					class="hover:bg-surface-400-500-token w-full px-2 py-1"
					on:click={() => uploadAvatarEl.click()}
				>
					Change avatar
				</button>
				<button class="hover:bg-surface-400-500-token w-full px-2 py-1" on:click={removeAvatar}>
					Remove avatar
				</button>
				<div class="arrow bg-surface-100-800-token" />
			</div>
			<input
				type="file"
				accept="image/*"
				name="photo"
				hidden
				on:change={handleSelectedAvatar}
				bind:this={uploadAvatarEl}
			/>
			<div class="flex h-full flex-col justify-center">
				<span class="text-2xl">
					{$user.personal_data.name.first}
					{$user.personal_data.name.last}
				</span>
				<span class="text-secondary-700-200-token text-lg">
					{sectionsMap.get($user.personal_data.section)}
				</span>
			</div>
		</div>
		<div
			class="relative z-[1] flex h-72 w-full flex-col items-center justify-center bg-gradient-to-r from-blue-950 to-rose-950 px-[5%]"
		>
			<!-- Temporary rank logo -->
			<div class="absolute -top-[17%] left-1/2 -translate-x-1/2">
				<div class="aspect-square w-24 rotate-45 border-4 border-white bg-red-600" />
			</div>
			<span
				class="font-gt-walsheim-pro-medium text-outline select-none text-[12rem] uppercase tracking-wide opacity-20"
			>
				{$user.rank.title}
			</span>
		</div>
		<div class="z-10 flex h-20 w-full px-[5%]">
			<div class="mb-8 w-full flex-none self-end">
				<div class="flex w-full justify-center gap-16">
					<div
						class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
					>
						<span class="text-xl">Overall Ranking</span>
						<span class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-3xl">
							#{$user.rank.number.overall}
						</span>
					</div>
					<div
						class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
					>
						<span class="text-xl">Score</span>
						<span class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-3xl">
							{$user.score}
						</span>
					</div>
					<div
						class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
					>
						<span class="text-xl">Section Ranking</span>
						<span class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-3xl">
							#{$user.rank.number.section}
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="bg-surface-100-800-token flex h-20 w-full items-center px-[5%]">
			<span class="w-1/2 text-center text-2xl uppercase">upcoming match</span>
			<span class="w-1/2 text-center text-2xl uppercase">power cards</span>
		</div>
		<div class="flex w-full gap-10 px-[5%] py-10">
			<!-- Upcoming match -->
			<div class="flex w-1/2">
				{#if pendingMatch && $opponent}
					<div class="flex flex-col items-start">
						<div class="flex items-center gap-4">
							<span class="font-gt-walsheim-pro-medium text-2xl uppercase">vs</span>
							<div class="flex items-center gap-4">
								<div class="pointer-events-none select-none">
									<Avatar
										src={$opponent.auth_data.photo_url || ''}
										width="w-20"
										initials={opponentInitials}
									/>
								</div>
								<div class="flex flex-col">
									<a class="hover:underline" href={`/users/${$opponent.auth_data.uid}`}>
										<span class="text-xl">
											{$opponent.personal_data.name.first}
											{$opponent.personal_data.name.last}
										</span>
									</a>
									<div class="flex gap-4">
										<span class="uppercase opacity-75">
											{$opponent.rank.title}
										</span>
										<span class="mx-5 opacity-75">|</span>
										<div class="opacity-75">
											<span>Overall:</span>
											<span class="text-secondary-700-200-token">
												#{$opponent.rank.number.overall}
											</span>
										</div>
										<div class="opacity-75">
											<span>Section:</span>
											<span class="text-secondary-700-200-token">
												#{$opponent.rank.number.section}
											</span>
										</div>
										<div class="opacity-75">
											<span>Score:</span>
											<span class="text-secondary-700-200-token">
												{$opponent.score}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="ml-5 flex w-full justify-center gap-4">
							<div class="flex flex-col">
								<span>Skill to perform:</span>
								<span class="text-tertiary-400">{pendingMatch.skill}</span>
							</div>
							<div class="flex flex-col">
								<span>Footwork to perform:</span>
								<span class="text-tertiary-400">{pendingMatch.footwork}</span>
							</div>
						</div>
						{#if $opponent.power_cards.find((card) => card.activated && !card.used)}
							<div class="flex flex-col">
								{#each $opponent.power_cards as card, idx (idx)}
									{#if card.activated && !card.used}
										<span>{card.name}</span>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<span class="flex w-full justify-center opacity-50">No upcoming match</span>
				{/if}
			</div>

			<!-- Power cards the user has -->
			<div class="flex w-1/2 flex-wrap justify-center gap-10">
				{#each $user.power_cards as card, idx (idx)}
					<button
						class={`card aspect-[1/1.3] w-1/4 p-4 ${card.used ? 'opacity-50' : 'opacity-100'} ${
							card.activated && !card.used ? 'border-2 border-green-500' : 'border-none'
						}`}
						on:click={() => {
							selectedPowerCard.set(card.key);
						}}
						disabled={card.used || card.activated}
					>
						<svelte:component this={powerCardsMap.get(card.key)?.components.card} />
					</button>
				{/each}
			</div>
		</div>

		{#if $selectedPowerCard}
			<PowerCard />
		{/if}
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
						{#each sectionsMap as [key, value], idx (idx)}
							<option value={key}>{value}</option>
						{/each}
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

<style>
	.text-outline {
		color: white;
		-webkit-text-fill-color: transparent;
		-webkit-text-stroke-width: 1px;
		/* -webkit-background-clip: text; */
		/* background-clip: text; */
	}
</style>
