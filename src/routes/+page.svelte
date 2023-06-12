<script lang="ts">
	import type { UserData } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { googleAuthPopup } from '$lib/firebase/auth';
	import { currentUser } from '$lib/store';

	$: user = getContext<Writable<UserData>>('user');

	async function login() {
		const userAuth = await googleAuthPopup();
		const authData = userAuth?.userData.auth_data;
		const personalData = userAuth?.userData.personal_data;

		if (!userAuth) return;

		console.log('Setting stores...');

		// Update the current store
		currentUser.update(
			(val) =>
				(val = {
					auth_data: {
						email: authData?.email || '',
						is_logged_in: authData?.is_logged_in || false,
						is_registered: authData?.is_registered || false,
						photo_url: authData?.photo_url || '',
						uid: authData?.uid || '',
						username: authData?.username || '',
						role: authData?.role || ''
					},
					personal_data: {
						age: personalData?.age || -1,
						contact_number: personalData?.contact_number || -1,
						name: {
							first: personalData?.name.first || '',
							last: personalData?.name.last || ''
						},
						section: personalData?.section || '',
						sex: personalData?.sex || ''
					}
				})
		);

		console.log('Stores set!');

		console.log($user);
	}
</script>

<div class="flex h-full flex-col items-center justify-center">
	{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
		<div>Hello {$user.auth_data.username}</div>
	{:else if $user.auth_data.is_logged_in && !$user.auth_data.is_registered}
		<div class="p-4 variant-filled-surface rounded-md">
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
		<h1 class="font-gt-walsheim-pro-medium text-center text-9xl uppercase select-none mb-10">
			Kali Kalihim
		</h1>
		<button
			class="rounded-lg border-[1px] border-white p-2 flex items-center gap-5 select-none"
			on:click={login}
		>
			<span class="text-xl">Sign in with Google</span>
		</button>
	{/if}
</div>
