<script lang="ts">
	import { sectionsMap } from '$lib/data';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { Edit } from '$lib/assets/icons';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { enhance } from '$app/forms';

	export let data;

	$: currentUser = getContext<Writable<UserData>>('user');
	$: user = data.user;

	let loading = false;
	let success = false;
	let initials: string = '';

	let editModal: HTMLDialogElement;
	let deleteModal: HTMLDialogElement;

	if (data.user) {
		initials = `${data.user.personal_data.name.first[0]}${data.user.personal_data.name.last[0]}`;
	}

	if (data.user) {
		const userRef = doc(db, 'users', data.user.auth_data.uid);

		const unsubUser = onSnapshot(userRef, (snapshot) => {
			user = snapshot.data() as UserData;
		});

		onDestroy(() => unsubUser());
	}

	function cancelEdit() {
		loading = false;
		success = false;

		editModal.close();
	}
</script>

<div class="flex h-full w-full flex-col items-center">
	<!-- Banner -->
	<div class="relative h-40 w-full lg:h-80">
		{#if user.auth_data.banner_url}
			<img
				class="h-full w-full object-cover object-center"
				src={user.auth_data.banner_url}
				role="banner"
				alt="banner"
				loading="lazy"
			/>
		{:else}
			<div class="bg-surface-300-600-token h-40 lg:h-80" />
		{/if}
	</div>
	<div class="bg-surface-200-700-token flex h-32 w-full items-center gap-4 px-[5%]">
		<div class="shadow-profile flex h-20 w-20 rounded-full lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end">
			<Avatar src={user.auth_data.photo_url || ''} width="w-20 lg:w-40" {initials} />
		</div>
		<div class="flex h-full flex-col justify-center">
			<span class="text-xl lg:text-2xl">
				{user.personal_data.name.first}
				{user.personal_data.name.last}
			</span>
			<span class="text-secondary-700-200-token text-base lg:text-lg">
				{sectionsMap.get(user.personal_data.section)}
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
			class="font-gt-walsheim-pro-medium text-outline w-full select-none text-start text-[10rem] uppercase tracking-wide opacity-20 lg:text-center lg:text-[12rem]"
		>
			{user.rank.title}
		</span>
	</div>
	<div class="z-10 flex h-20 w-full px-[5%]">
		<div class="mb-8 w-full flex-none self-end">
			<div class="flex w-full justify-center gap-4 lg:gap-16">
				<div
					class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
				>
					<span class="text-base lg:text-xl">Overall Ranking</span>
					<span
						class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-xl lg:text-3xl"
					>
						#{user.rank.number.overall}
					</span>
				</div>
				<div
					class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
				>
					<span class="text-base lg:text-xl">Score</span>
					<span
						class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-xl lg:text-3xl"
					>
						{user.score}
					</span>
				</div>
				<div
					class="bg-surface-300-600-token flex w-60 flex-col justify-center rounded-md p-4 shadow-lg"
				>
					<span class="text-base lg:text-xl">Section Ranking</span>
					<span
						class="font-gt-walsheim-pro-medium text-secondary-700-200-token text-xl lg:text-3xl"
					>
						#{user.rank.number.section}
					</span>
				</div>
			</div>
		</div>
	</div>

	{#if $currentUser.auth_data.role === 'admin'}
		<div class="fixed bottom-10 right-10 z-40 flex gap-4">
			<button class="btn variant-filled flex gap-4" on:click={() => editModal.showModal()}>
				<span>Edit</span>
				<Edit styles="w-5" />
			</button>
			<button class="btn variant-filled flex gap-4" on:click={() => deleteModal.showModal()}>
				<span>Delete</span>
				<Edit styles="w-5" />
			</button>
		</div>

		<!-- Edit user information -->
		<dialog
			class="bg-surface-100-800-token rounded-container-token text-token w-modal-slim p-4 shadow-xl"
			bind:this={editModal}
		>
			{#if !loading && !success}
				<form
					class="space-y-4"
					method="post"
					action={`/users/${user.auth_data.uid}?/edit`}
					use:enhance={() => {
						console.log('Submitting');
						loading = true;

						return async ({ result }) => {
							if (result.type === 'success') {
								console.log('Submitted');
								success = true;
								loading = false;
							} else {
								console.error('Something went wrong.');
								success = false;
								loading = false;
							}
						};
					}}
				>
					<label class="label">
						<span>First Name</span>
						<input
							class="input variant-form-material"
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
							class="input variant-form-material"
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
							class="input variant-form-material"
							type="text"
							value={user.personal_data.age}
							placeholder="eg. 18"
							name="age"
							required
						/>
					</label>

					<label class="label">
						<span>Sex</span>
						<select
							class="select variant-form-material"
							value={user.personal_data.sex}
							name="sex"
							required
						>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</label>

					<label class="label">
						<span>Section</span>
						<select
							class="select variant-form-material"
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
							class="input variant-form-material"
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
							class="input variant-form-material"
							type="tel"
							value={user.personal_data.contact_number}
							placeholder="eg. 09123456789"
							name="contact-number"
							required
						/>
					</label>

					<label class="label">
						<span>Score</span>
						<input
							class="input variant-form-material"
							type="text"
							value={user.score}
							name="score"
							required
						/>
					</label>

					<label class="label">
						<span>Role</span>
						<select
							class="select variant-form-material"
							value={user.auth_data.role}
							name="role"
							required
						>
							<option value="admin">Admin</option>
							<option value="user">User</option>
						</select>
					</label>

					<div class="flex justify-end gap-4">
						<button class="btn variant-ghost-surface" type="button" on:click={cancelEdit}>
							Cancel
						</button>
						<button class="btn variant-filled-primary" type="submit">Submit</button>
					</div>
				</form>
			{:else if loading && !success}
				<div>Submitting...</div>
				<div class="flex justify-end">
					<button class="btn variant-ghost-surface" type="button" on:click={cancelEdit}>
						Cancel
					</button>
				</div>
			{:else if !loading && success}
				<div>Data successfuly changed!</div>
				<div class="flex justify-end">
					<button class="btn variant-ghost-surface" type="button" on:click={cancelEdit}>
						Close
					</button>
				</div>
			{/if}
		</dialog>

		<!-- Delete user -->
		<dialog
			class="bg-surface-100-800-token rounded-container-token text-token w-modal p-4 shadow-xl"
			bind:this={deleteModal}
		>
			<p>
				Delete
				<span class="font-bold">
					{user.personal_data.name.first}
					{user.personal_data.name.last}
				</span>
				?
			</p>
			<form
				class="space-y-4"
				method="post"
				action={`/users/${user.auth_data.uid}?/delete`}
				use:enhance={() => {
					console.log('Submitting');
					loading = true;

					return async ({ result }) => {
						if (result.type === 'success') {
							console.log('Deleted');
							success = true;
							loading = false;
						} else {
							console.error('Something went wrong.');
							success = false;
							loading = false;
						}
					};
				}}
			>
				<div class="flex justify-end">
					<button
						class="btn variant-ghost-surface"
						type="button"
						on:click={() => deleteModal.close()}
					>
						Close
					</button>
					<button class="btn variant-filled-primary" type="submit">Delete</button>
				</div>
			</form>
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
