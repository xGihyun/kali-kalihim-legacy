<script lang="ts">
	import { enhance } from '$app/forms';
	import { sectionsMap } from '$lib/data.js';

	export let data;

	$: user = data.user;

	let scoreModal: HTMLDialogElement;
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<h1>I guess information about the user is here?</h1>
	<span class="text-4xl uppercase">(rank logo)</span>
	{#if user.rank.title}
		<span class="text-3xl uppercase">{user.rank.title}</span>
	{/if}
	<div class="flex flex-col items-center">
		<span>
			{user.personal_data.name.first}
			{user.personal_data.name.last}
		</span>
		<span>
			{sectionsMap.get(user.personal_data.section)}
		</span>
	</div>
	<div class="flex flex-col gap-4">
		<div class="flex gap-4">
			<div class="flex flex-col">
				<span>Overall Ranking:</span>
				<span class="text-secondary-700-200-token text-2xl">#{user.rank.number.overall}</span>
			</div>
			<div class="flex flex-col">
				<span>Section Ranking:</span>
				<span class="text-secondary-700-200-token text-2xl">#{user.rank.number.section}</span>
			</div>
		</div>
		<div>
			<div>
				<span>Score:</span>
				<span>{user.score}</span>
			</div>
			<button
				class="variant-ghost-primary btn"
				type="button"
				on:click={() => {
					scoreModal.showModal();
				}}
			>
				Edit
			</button>
			<dialog
				class="bg-surface-100-800-token rounded-container-token text-token p-4 shadow-xl"
				bind:this={scoreModal}
			>
				<form class="space-y-4" method="post" action="?/set" use:enhance>
					<label class="label">
						<span>
							Set score for
							{user.personal_data.name.first}
							{user.personal_data.name.last}
						</span>
						<input class="input" type="text" name="score" required />
					</label>
					<div class="flex justify-end gap-4">
						<button
							class="btn variant-ghost-surface"
							type="button"
							on:click={() => scoreModal.close()}
						>
							Cancel
						</button>
						<button class="btn variant-filled-primary" type="submit">Submit</button>
					</div>
				</form>
			</dialog>
		</div>
	</div>
</div>
