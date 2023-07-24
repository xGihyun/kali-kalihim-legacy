<script lang="ts">
	import { enhance } from '$app/forms';
	import { powerCardsMap } from '$lib/data';
	import { PowerCard } from '../powercards';

	let checkedPowerCards: string[] = [];
</script>

<div class="px-main py-10">
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
						<PowerCard {key} showDescription={true} showName={true} />
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
