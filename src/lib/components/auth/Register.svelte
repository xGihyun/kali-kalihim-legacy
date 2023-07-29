<script lang="ts">
	import type { UserData } from '$lib/types';
	import { getSections } from '$lib/utils/functions';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const user = getContext<Writable<UserData>>('user');
</script>

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
			<select class="select variant-form-material" name="section" required>
				{#await getSections()}
					<span>Loading sections...</span>
				{:then sections}
					{#each sections as [key, value], idx (idx)}
						<option value={key}>{value}</option>
					{/each}
				{/await}
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
