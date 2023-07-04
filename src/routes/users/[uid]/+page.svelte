<script lang="ts">
	import { sectionsMap } from '$lib/data';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { Edit } from '../../../assets/icons';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';

	export let data;

	$: currentUser = getContext<Writable<UserData>>('user');
	$: user = data.user;

	let loading = false;
	let success = false;
	let initials: string = '';
	let modal: HTMLDialogElement;

	if (data.user) {
		initials = `${data.user.personal_data.name.first[0]}${data.user.personal_data.name.last[0]}`;
	}

	async function handleSubmit(event: Event) {
		loading = true;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		formData.append('uid', data.user.auth_data.uid);

		const response = await fetch('../../api/edit', { method: 'POST', body: formData });

		if (!response.ok) {
			console.error('Error in changing data: ' + response.statusText);
			loading = false;
			form.reset();
			return;
		}

		success = true;
		loading = false;
		form.reset();
	}

	if (data.user) {
		const userRef = doc(db, 'users', data.user.auth_data.uid);

		const unsubUser = onSnapshot(userRef, (snapshot) => {
			user = snapshot.data() as UserData;
		});

		onDestroy(() => unsubUser());
	}
</script>

<div class="flex h-full w-full flex-col items-center">
	<!-- Banner -->
	<!-- TEMPORARY -->
	<img
		class="h-80 w-full object-cover object-[0_-8rem]"
		src="https://images5.alphacoders.com/128/1284718.jpg"
		alt="kessoku band"
	/>
	<div class="bg-surface-200-700-token flex h-32 w-full gap-4 px-[5%]">
		<div
			class="shadow-profile pointer-events-none mb-10 flex-none select-none self-end rounded-full"
		>
			<Avatar src={user.auth_data.photo_url || ''} width="w-40" {initials} />
		</div>
		<div class="flex h-full flex-col justify-center">
			<span class="text-2xl">
				{user.personal_data.name.first}
				{user.personal_data.name.last}
			</span>
			<span class="text-secondary-700-200-token text-lg">
				{sectionsMap.get(user.personal_data.section)}
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
			{user.rank.title}
		</span>
	</div>
	<div class="z-10 flex h-20 w-full px-[5%]">
		<div class="mb-8 w-full flex-none self-end">
			<div class="flex w-full justify-center gap-16">
				<div
					class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
				>
					<span class="text-xl">Overall Ranking</span>
					<span class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-3xl"
						>#{user.rank.number.overall}</span
					>
				</div>
				<div
					class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
				>
					<span class="text-xl">Score</span>
					<span class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-3xl"
						>{user.score}</span
					>
				</div>
				<div
					class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
				>
					<span class="text-xl">Section Ranking</span>
					<span class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-3xl"
						>#{user.rank.number.section}</span
					>
				</div>
			</div>
		</div>
	</div>

	{#if $currentUser.auth_data.role === 'admin'}
		<button
			class="btn variant-filled fixed bottom-10 right-10 z-40 flex gap-4"
			on:click={() => modal.showModal()}
		>
			<span>Edit</span>
			<Edit styles="w-5" />
		</button>

		<!-- Modal -->
		<dialog
			class="bg-surface-100-800-token rounded-container-token text-token w-modal-slim p-4 shadow-xl"
			bind:this={modal}
		>
			{#if !loading && !success}
				<form class="space-y-4" on:submit|preventDefault={(e) => handleSubmit(e)}>
					<label class="label">
						<span>First Name</span>
						<input
							class="input"
							type="text"
							value={user.personal_data.name.first}
							placeholder="eg. Ayaka"
							name="first-name"
							required
						/>
					</label>

					<label class="label">
						<span>Last Name</span>
						<input
							class="input"
							type="text"
							value={user.personal_data.name.last}
							placeholder="eg. Kamisato"
							name="last-name"
							required
						/>
					</label>

					<label class="label">
						<span>Age</span>
						<input
							class="input"
							type="text"
							value={user.personal_data.age}
							placeholder="eg. 18"
							name="age"
							required
						/>
					</label>

					<label class="label">
						<span>Sex</span>
						<select class="input" size="1" value={user.personal_data.sex} name="sex" required>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</label>

					<label class="label">
						<span>Section</span>
						<select
							class="input"
							size="1"
							value={user.personal_data.section}
							name="section"
							required
						>
							{#each sectionsMap as [key, value], idx (idx)}
								<option value={key}>{value}</option>
							{/each}
						</select>
					</label>

					<label class="label">
						<span>Email</span>
						<input
							class="input"
							type="email"
							value={user.auth_data.email}
							placeholder="Aa"
							name="email"
							required
						/>
					</label>

					<label class="label">
						<span>Contact No.</span>
						<input
							class="input"
							type="tel"
							value={user.personal_data.contact_number}
							placeholder="eg. 09123456789"
							name="contact-number"
							required
						/>
					</label>

					<label class="label">
						<span>Score</span>
						<input class="input" type="text" value={user.score} name="score" required />
					</label>

					<div class="flex justify-end gap-4">
						<button class="btn variant-ghost-surface" type="button" on:click={() => modal.close()}>
							Cancel
						</button>
						<button class="btn variant-filled-primary" type="submit">Submit</button>
					</div>
				</form>
			{:else if loading && !success}
				<div>Submitting...</div>
				<div class="flex justify-end">
					<button
						class="btn variant-ghost-surface"
						type="button"
						on:click={() => {
							loading = false;
							success = false;
							modal.close();
						}}
					>
						Cancel
					</button>
				</div>
			{:else if success && !loading}
				<div>Data successfuly changed!</div>
				<div class="flex justify-end">
					<button
						class="btn variant-ghost-surface"
						type="button"
						on:click={() => {
							success = false;
							loading = false;
							modal.close();
						}}
					>
						Close
					</button>
				</div>
			{/if}
		</dialog>
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
