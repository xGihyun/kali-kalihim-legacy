<script lang="ts">
	import type { UserData } from '$lib/types.js';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let data;

	let users = data.users;

	$: currentUser = getContext<Writable<UserData>>('user');
</script>

<div class="flex h-full flex-col items-center justify-center px-[5%]">
	<div class="table-container max-w-5xl">
		<table class="table table-compact table-hover">
			<thead>
				<tr>
					<th>Name</th>
					<th>Section</th>
					<th>Rating</th>
				</tr>
			</thead>
			<tbody>
				{#each users as user, idx (idx)}
					<tr
						class={`${
							user.auth_data.uid === $currentUser.auth_data.uid
								? 'text-tertiary-400'
								: 'text-secondary-200'
						}`}
					>
						<td
							><span class="font-bold text-white">#{idx + 1}</span>
							<span>
								{user.personal_data.name.first}
								{user.personal_data.name.last}
								<span /></span
							></td
						>
						<td>{user.personal_data.section}</td>
						<td>{user.score}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
