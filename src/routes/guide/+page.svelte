<script>
	import { arnisFootworks, arnisSkills, powerCardsMap } from '$lib/data';
</script>

<div class="flex h-full w-full flex-col items-center gap-10 px-[5%] py-10">
	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Skills</h2>
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
			{#each arnisSkills as video, idx (idx)}
				<a class="w-40 lg:w-60" href={video.url} target="_blank" rel="noreferrer">
					<div class="flex aspect-square h-full w-full flex-col rounded-md lg:gap-1">
						<div
							class="bg-surface-400-500-token h-full w-full rounded-md p-2 text-center transition-[filter] duration-150 hover:brightness-125"
						/>
						<span class="flex-auto text-sm lg:text-lg">{video.title}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Footworks</h2>
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
			{#each arnisFootworks as video, idx (idx)}
				<a class="w-40 lg:w-60" href={video.url} target="_blank" rel="noreferrer">
					<div class="flex aspect-square h-full w-full flex-col rounded-md lg:gap-1">
						<div
							class="bg-surface-400-500-token h-full w-full rounded-md p-2 text-center transition-[filter] duration-150 hover:brightness-125"
						/>
						<span class="flex-auto text-sm lg:text-lg">{video.title}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
	<div>
		<h2 class="mb-2 font-gt-walsheim-pro-medium text-xl lg:text-5xl">Power Cards</h2>
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
			{#each powerCardsMap as [_, value], idx (idx)}
				<div class="flex aspect-square w-40 flex-col rounded-md lg:w-60 lg:gap-1">
					<svelte:component this={value.components.card} showName={false} />
					<span class="flex-auto text-sm lg:text-lg">{value.name}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
