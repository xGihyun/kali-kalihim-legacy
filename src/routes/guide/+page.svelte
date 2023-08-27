<script lang="ts">
	import { Close, YouTube } from '$lib/assets/icons';
	import { PowerCard } from '$lib/components/powercards';
	import { arnisFootworks, arnisSkills, powerCardsMap } from '$lib/data';
	import { blockCards, strikeCards } from '$lib/data';

	let clickedRow: number | null = null;

	function toggleCard(idx: number) {
		clickedRow = clickedRow === idx ? null : idx;
	}
</script>

<div class="flex h-full w-full flex-col items-center gap-10 px-main py-10">
	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Skills</h2>
		<div
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4"
		>
			{#each arnisSkills as video, idx (idx)}
				<a class="w-40 lg:w-60" href={video.url} target="_blank" rel="noreferrer">
					<div class="flex aspect-square h-full w-full flex-col rounded-md lg:gap-1">
						<div
							class="flex justify-center items-center bg-surface-400-500-token h-full w-full rounded-md p-2 text-center transition-[filter] duration-150 hover:brightness-125"
						>
							<YouTube styles="w-10 h-10 lg:w-20 lg:h-20" />
						</div>
						<span class="flex-auto text-sm lg:text-lg">{video.title}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Footworks</h2>
		<div
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4"
		>
			{#each arnisFootworks as video, idx (idx)}
				<a class="w-40 lg:w-60" href={video.url} target="_blank" rel="noreferrer">
					<div class="flex aspect-square h-full w-full flex-col rounded-md lg:gap-1">
						<div
							class="flex justify-center items-center bg-surface-400-500-token h-full w-full rounded-md p-2 text-center transition-[filter] duration-150 hover:brightness-125"
						>
							<YouTube styles="w-10 h-10 lg:w-20 lg:h-20" />
						</div>
						<span class="flex-auto text-sm lg:text-lg">{video.title}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Power Cards</h2>
		<div
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4"
		>
			{#each powerCardsMap as [key, value], idx (idx)}
				<button
					class="flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1"
					on:click={() => toggleCard(idx)}
				>
					<PowerCard {key} showName={false} />
					<span class="flex-auto text-sm lg:text-lg">{value.name}</span>
				</button>

				{#if clickedRow === idx}
					<div class="fixed left-0 top-0 z-[999] h-full w-full bg-surface-backdrop-token">
						<div class="flex h-full w-full items-center justify-center p-2">
							<!-- Modal -->
							<div
								class="w-full sm:w-3/4 flex flex-col relative shadow-xl bg-surface-100-800-token overflow-hidden rounded-container-token h-3/4"
							>
								<div class="w-full flex justify-between items-center p-4 gap-4 h-16">
									<h1 class="font-gt-walsheim-pro-medium text-2xl">Power Cards</h1>
									<button class="" on:click={() => toggleCard(idx)}>
										<Close styles="w-8 h-8" />
									</button>
								</div>
								<hr />
								<div class="w-full h-full flex overflow-auto p-4">
									<div class="flex flex-col items-center w-full h-full">
										<div class="flex h-1/2 aspect-[1/1.3]">
											<PowerCard {key} showName={false} />
										</div>
										<span class="text-sm lg:text-lg">{value.name}</span>
									</div>
									<div class="flex w-full h-full">{value.description?.full}</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Strike Cards</h2>
		<div
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4"
		>
			{#each strikeCards as [_, value], idx (idx)}
				{@const { damage, accuracy, effect, name } = value}

				<button
					class="flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 bg-surface-400-500-token p-2"
				>
					<span class="text-sm lg:text-lg">{name}</span>
					<div class="flex flex-col text-left">
						<span class="text-sm lg:text-lg">Damage: {damage}</span>
						<span class="text-sm lg:text-lg">Accuracy: {accuracy * 100}%</span>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Blocks Cards</h2>
		<div
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4"
		>
			{#each blockCards as [_, value], idx (idx)}
				{@const { name, reduction, strike_to_cancel, effect } = value}

				<button
					class="flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 bg-surface-400-500-token p-2"
				>
					<span class="text-sm lg:text-lg">{name}</span>
					<div class="flex flex-col text-left">
						<span class="text-sm lg:text-lg">Damage Reduction: {reduction * 100}%</span>
						<p class="text-sm lg:text-lg">
							Cancels
							<span class="text-tertiary-300">{strike_to_cancel}</span>
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
