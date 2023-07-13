<script lang="ts">
	import { PowerCard } from '$lib/components';
	import { db } from '$lib/firebase/firebase';
	import { currentUser, latestOpponent, selectedPowerCard } from '$lib/store';
	import type { Match, UserData } from '$lib/types';
	import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Banner, SelectPowerCards, UpcomingMatch, UserAvatar, Rank } from '$lib/components/user';

	export let data;

	$: sectionsMap = getContext<Writable<Map<string, string>>>('sections');

	let initials: string = '';
	let opponentInitials: string = '';

	$: user = getContext<Writable<UserData>>('user');
	$: opponent = getContext<Writable<UserData>>('opponent');

	$: pendingMatch = data?.latestPendingMatch;
	// $: topUsers = data?.topUsers;

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
		});

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
		});

		onDestroy(() => {
			unsubUser();
			unsubPendingMatch();
		});
	}

	$: if (data.latestOpponent) {
		opponentInitials = `${data.latestOpponent.personal_data.name.first[0]}${data.latestOpponent.personal_data.name.last[0]}`;

		const opponentRef = doc(db, 'users', data.latestOpponent.auth_data.uid);

		const unsubOpponent = onSnapshot(opponentRef, (snapshot) => {
			if (!snapshot.exists()) return;

			const updatedOpponentData = snapshot.data() as UserData;

			latestOpponent.update((val) => (val = updatedOpponentData));
		});

		onDestroy(() => unsubOpponent());
	}
</script>

<!-- TODO: MAKE STUFF LOOK GOOD -->
<div class="flex h-full w-full flex-col items-center justify-center">
	{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
		{#if $user.power_cards.length < 3}
			<SelectPowerCards />
		{:else}
			<Banner />
			<UserAvatar {initials} />
			<Rank user={$user} />
			<UpcomingMatch {pendingMatch} opponent={$opponent} initials={opponentInitials} />

			{#if $selectedPowerCard}
				<PowerCard />
			{/if}

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
						{#each $sectionsMap as [key, value], idx (idx)}
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
