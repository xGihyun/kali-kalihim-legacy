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
	import { Edit } from '$lib/assets/icons';
	import { crop } from '$lib/pkg/my_package';
	import { enhance } from '$app/forms';

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
	$: topUsers = data?.topUsers;

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

	let checkedPowerCards: string[] = [];

	function testSubmit() {
		console.log(checkedPowerCards);
	}

	// TODO: Add cropping with preview?
</script>

<!-- TODO: MAKE STUFF LOOK GOOD -->
<div class="flex h-full w-full flex-col items-center justify-center">
	{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
		{#if $user.power_cards.length < 3}
			<div class="px-[5%] py-10">
				<p class="mb-10 text-center text-base uppercase lg:text-2xl">
					Please select three (3) power cards
				</p>
				<form
					class="space-y-10"
					method="post"
					action="?/powercards"
					use:enhance={(e) => e.formData.append('cards', JSON.stringify(checkedPowerCards))}
				>
					<div class="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-10">
						{#each powerCardsMap as [key, value], idx (idx)}
							<label
								class={`flex w-full max-w-[15rem] cursor-pointer flex-col gap-2 ${
									checkedPowerCards.length > 2 && !checkedPowerCards.includes(key)
										? 'opacity-50'
										: 'opacity-100'
								}`}
							>
								<div class="w-full">
									<svelte:component
										this={value.components.card}
										showDescription={true}
										showName={false}
									/>
								</div>
								<label class="flex w-full items-center gap-2">
									<input
										class="checkbox"
										type="checkbox"
										value={key}
										bind:group={checkedPowerCards}
										disabled={checkedPowerCards.length > 2 && !checkedPowerCards.includes(key)}
									/>
									<p class="whitespace-nowrap text-xs lg:text-base">
										{value.name}
									</p>
								</label>
							</label>
						{/each}
					</div>
					<div class="flex w-full justify-center">
						<button class="btn variant-filled-primary">Submit</button>
					</div>
				</form>
			</div>
		{:else}
			<!-- Banner -->
			<div class="relative h-40 w-full lg:h-80">
				{#if $user.auth_data.banner_url}
					<img
						class="h-full w-full object-cover object-center"
						src={$user.auth_data.banner_url}
						role="banner"
						alt="banner"
						loading="lazy"
					/>
				{:else}
					<div class="h-40 bg-surface-300-600-token lg:h-80" />
				{/if}
				<button
					class="absolute bottom-2 right-5 rounded-full p-2 transition-[background-color] duration-100 bg-surface-300-600-token hover:bg-surface-500-400-token"
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
						class="w-full px-2 py-1 hover:bg-surface-400-500-token"
						on:click={() => uploadBannerEl.click()}
					>
						<span class="text-base">Change banner</span>
					</button>
					<button class="w-full px-2 py-1 hover:bg-surface-400-500-token" on:click={removeBanner}>
						<span class="text-base">Remove banner</span>
					</button>
					<div class="arrow bg-surface-100-800-token" />
				</div>
			</div>
			<div class="flex h-32 w-full items-center gap-4 px-[5%] bg-surface-200-700-token">
				<button
					class="flex h-20 w-20 rounded-full shadow-profile lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end"
					title="Change your avatar!"
					use:popup={popupChangeAvatar}
				>
					<Avatar src={$user.auth_data.photo_url || ''} width="w-20 lg:w-40" {initials} />
				</button>
				<div class="card z-20 w-40 py-2 shadow-xl transition-none duration-0" data-popup="avatar">
					<button
						class="w-full px-2 py-1 hover:bg-surface-400-500-token"
						on:click={() => uploadAvatarEl.click()}
					>
						<span class="text-base">Change avatar</span>
					</button>
					<button class="w-full px-2 py-1 hover:bg-surface-400-500-token" on:click={removeAvatar}>
						<span class="text-base">Remove avatar</span>
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
					<span class="text-xl lg:text-2xl">
						{$user.personal_data.name.first}
						{$user.personal_data.name.last}
					</span>
					<span class="text-base text-secondary-700-200-token lg:text-lg">
						{sectionsMap.get($user.personal_data.section)}
					</span>
				</div>
			</div>
			<div
				class="relative z-[1] flex h-36 w-full flex-col items-center justify-center bg-gradient-to-r from-blue-950 to-rose-950 px-[5%] py-2 lg:h-72"
			>
				<!-- Temporary rank logo -->
				<div class="absolute -top-[17%] left-1/2 hidden -translate-x-1/2 lg:block">
					<div class="aspect-square rotate-45 border-4 border-white bg-red-600 lg:w-24" />
				</div>
				<span
					class="text-outline w-full select-none text-start font-gt-walsheim-pro-medium text-[10rem] uppercase tracking-wide opacity-20 lg:text-center lg:text-[12rem]"
				>
					{$user.rank.title}
				</span>
			</div>
			<div class="z-10 flex h-16 w-full px-[5%] lg:h-20">
				<div class="mb-8 w-full flex-none self-end">
					<div class="flex w-full justify-center gap-4 lg:gap-16">
						<div
							class="flex w-60 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token lg:p-4"
						>
							<span class="text-base lg:text-xl">Overall</span>
							<span
								class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token lg:text-3xl"
							>
								#{$user.rank.number.overall}
							</span>
						</div>
						<div
							class="flex w-60 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token lg:p-4"
						>
							<span class="text-base lg:text-xl">Score</span>
							<span
								class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token lg:text-3xl"
							>
								{$user.score}
							</span>
						</div>
						<div
							class="flex w-60 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token lg:p-4"
						>
							<span class="text-base lg:text-xl">Section</span>
							<span
								class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token lg:text-3xl"
							>
								#{$user.rank.number.section}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div class="flex w-full flex-col gap-2 lg:flex-row lg:px-[5%]">
				<div class="flex w-full flex-col">
					<div class="flex h-20 w-full items-center px-[5%] bg-surface-100-800-token">
						<span class="w-full text-center text-2xl uppercase">upcoming match</span>
					</div>
					<div class="flex">
						{#if pendingMatch && $opponent}
							<div class="flex w-full flex-col gap-4">
								<div class="flex w-full flex-col">
									<div class="relative flex w-full items-center gap-4 p-4">
										<img
											class="absolute left-0 top-0 z-10 h-full w-full object-cover object-center brightness-50"
											src={$opponent.auth_data.banner_url}
											role="banner"
											alt="banner"
											loading="lazy"
										/>
										<div
											class="absolute left-0 top-0 z-[11] h-full w-full bg-gradient-to-t from-black opacity-75"
										/>
										<!-- <span class="font-gt-walsheim-pro-medium text-2xl uppercase">vs</span> -->
										<div class="z-20 flex items-center gap-4">
											<div
												class="pointer-events-none relative select-none rounded-full shadow-profile"
											>
												<Avatar
													src={$opponent.auth_data.photo_url || ''}
													width="w-16 lg:w-20"
													initials={opponentInitials}
												/>
											</div>
											<div class="flex flex-col">
												<a class="w-fit hover:underline" href={`/users/${$opponent.auth_data.uid}`}>
													<span class="text-xl">
														{$opponent.personal_data.name.first}
														{$opponent.personal_data.name.last}
													</span>
												</a>
												<span class="uppercase opacity-75">
													{$opponent.rank.title}
												</span>
											</div>
										</div>
									</div>

									<div class="flex h-full w-full justify-center gap-4 p-4 bg-surface-100-800-token">
										<div
											class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token"
										>
											<span class="text-base">Overall</span>
											<span
												class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token"
											>
												#{$opponent.rank.number.overall}
											</span>
										</div>
										<div
											class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token"
										>
											<span class="text-base">Score</span>
											<span
												class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token"
											>
												{$opponent.score}
											</span>
										</div>
										<div
											class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token"
										>
											<span class="text-base">Section</span>
											<span
												class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token"
											>
												#{$opponent.rank.number.section}
											</span>
										</div>
									</div>
								</div>

								<div class="flex gap-4">
									<div class="flex w-full flex-col">
										<div class="flex h-10 w-full items-center px-[5%] bg-surface-100-800-token">
											<span class="w-full text-center text-base uppercase lg:text-xl"
												>skill & footwork</span
											>
										</div>
										<div class="flex w-full flex-col justify-center gap-2 p-4">
											<div class="flex w-full flex-col justify-center rounded-md">
												<span class="text-xs uppercase lg:text-base">Skill</span>
												<span
													class="font-gt-walsheim-pro-medium text-sm text-tertiary-600-300-token lg:text-base"
												>
													{pendingMatch.skill}
												</span>
											</div>
											<div class="flex w-full flex-col justify-center rounded-md">
												<span class="text-xs uppercase lg:text-base">Footwork</span>
												<span
													class="font-gt-walsheim-pro-medium text-sm text-tertiary-600-300-token lg:text-base"
												>
													{pendingMatch.footwork}
												</span>
											</div>
										</div>
									</div>
									<!-- <div class="flex w-full flex-col">
									<div class="flex h-10 w-full items-center px-[5%] bg-surface-100-800-token">
										<span class="w-full text-center text-base uppercase lg:text-xl"
											>power cards used</span
										>
									</div>
									<div class="flex w-full flex-col justify-center rounded-md">
										{#if $opponent.power_cards.find((card) => card.activated && !card.used)}
											<div class="flex flex-col p-4">
												{#each $opponent.power_cards as card, idx (idx)}
													{#if card.activated && !card.used}
														<span
															class="font-gt-walsheim-pro-medium text-sm text-primary-600-300-token lg:text-base"
														>
															{card.name}
														</span>
													{/if}
												{/each}
											</div>
										{:else}
											<span>No power cards used</span>
										{/if}
									</div>
								</div> -->
								</div>
							</div>
						{:else}
							<span class="flex w-full justify-center opacity-50">No upcoming match</span>
						{/if}
					</div>
				</div>

				<div class="flex w-full flex-col">
					<div class="flex h-20 w-full items-center px-[5%] bg-surface-100-800-token">
						<span class="w-full text-center text-2xl uppercase">power cards</span>
					</div>
					<!-- Power cards the user has -->
					<div class="grid grid-cols-3 gap-2 px-[5%] py-10 lg:gap-10 lg:px-[10%]">
						{#each $user.power_cards as card, idx (idx)}
							<button
								class={`w-full max-w-[15rem] rounded-container-token ${card.used ? 'opacity-50' : 'opacity-100'} ${
									card.activated && !card.used ? 'border-4 border-green-500' : 'border-none'
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
			</div>

			<!-- <div class="flex w-full flex-col gap-2 lg:flex-row lg:px-[5%]">
			<div class="flex w-full flex-col">
				<div class="flex h-20 w-full items-center px-[5%] bg-surface-100-800-token">
					<span class="w-full text-center text-2xl uppercase">top performers</span>
				</div>
				{#if topUsers}
					<div class="flex flex-col items-center justify-center p-4">
						{#each topUsers as topPlayer (topPlayer.auth_data.uid)}
							{@const initials =
								topPlayer.personal_data.name.first[0] + topPlayer.personal_data.name.last[0]}
							<div
								class="pointer-events-none relative w-16 select-none rounded-full shadow-profile lg:w-20"
							>
								<Avatar src={topPlayer.auth_data.photo_url || ''} width="w-full" {initials} />
							</div>
							<div class="flex flex-col">
								<a class="w-fit hover:underline" href={`/users/${topPlayer.auth_data.uid}`}>
									<span class="text-base">
										{topPlayer.personal_data.name.first}
										{topPlayer.personal_data.name.last}
									</span>
								</a>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div> -->

			{#if $selectedPowerCard}
				<PowerCard />
			{/if}
		{/if}
	{:else if $user.auth_data.is_logged_in && !$user.auth_data.is_registered}
		<div class="variant-soft-surface rounded-md p-4">
			<form class="space-y-4" method="post" action="?/register">
				<label class="label">
					<span>First Name</span>
					<input
						class="input variant-form-material"
						type="text"
						placeholder="eg. Ayaka"
						name="first-name"
						required
					/>
				</label>

				<label class="label">
					<span>Last Name</span>
					<input
						class="input variant-form-material"
						type="text"
						placeholder="eg. Kamisato"
						name="last-name"
						required
					/>
				</label>

				<label class="label">
					<span>Age</span>
					<input
						class="input variant-form-material"
						type="text"
						placeholder="eg. 18"
						name="age"
						required
					/>
				</label>

				<label class="label">
					<span>Sex</span>
					<select class="select variant-form-material" value="male" name="sex" required>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</label>

				<label class="label">
					<span>Section</span>
					<select class="select variant-form-material" value="section-1" name="section" required>
						{#each sectionsMap as [key, value], idx (idx)}
							<option value={key}>{value}</option>
						{/each}
					</select>
				</label>

				<label class="label">
					<span>Email</span>
					<input
						class="input variant-form-material opacity-50"
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
						class="input variant-form-material"
						type="tel"
						placeholder="eg. 09123456789"
						name="contact-number"
						required
					/>
				</label>

				<div class="flex w-full justify-end">
					<button class="variant-filled-primary rounded-md p-2">Register</button>
				</div>
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
					class="mb-10 select-none text-center font-gt-walsheim-pro-medium text-5xl uppercase md:text-7xl 2xl:text-9xl"
				>
					Kali Kalihim
				</h1>
				<div class="flex flex-col gap-4">
					<form class="contents" method="post" action="?/login">
						<div>
							<label class="label text-lg">
								<span>Email</span>
								<input class="input variant-form-material" type="email" name="email" required />
							</label>

							<label class="label text-lg">
								<span>Password</span>
								<input
									class="input variant-form-material"
									type="password"
									name="password"
									required
								/>
							</label>
						</div>
						<button class="btn variant-filled-primary mx-auto flex">
							<span class="text-lg">Submit</span>
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
