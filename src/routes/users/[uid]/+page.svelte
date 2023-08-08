<script lang="ts">
	import { Edit } from '$lib/assets/icons';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { UserData } from '$lib/types';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { enhance } from '$app/forms';
	import { PowerCards, Rank, UserAvatar } from '$lib/components/user';

	export let data;

	const currentUser = getContext<Writable<UserData>>('user');
	$: ({ user, sections } = data);

	let loading = false;
	let success = false;
	let initials: string = '';

	let editModal: HTMLDialogElement;
	let deleteModal: HTMLDialogElement;

	if (data.user) {
		initials = `${data.user.personal_data.name.first[0]}${data.user.personal_data.name.last[0]}`;
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

	<UserAvatar {user} {initials} />

	<div class="w-full space-y-6">
		<Rank {user} />
		<div class="flex w-full flex-col justify-center gap-2 lg:flex-row lg:px-main">
			<PowerCards {user} />
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
			class="bg-surface-100-800-token text-token w-modal-slim p-4 shadow-xl rounded-container-token"
			bind:this={editModal}
		>
			<!-- Loading/success state can be improved, but use booleans for now -->
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
							{#each sections as section, idx (idx)}
								<option value={section.id}>{section.name}</option>
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
			class="bg-surface-100-800-token text-token w-modal p-4 shadow-xl rounded-container-token"
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
