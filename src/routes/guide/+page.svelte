<script>
	import { PowerCard } from '$lib/components/powercards';
	import { arnisFootworks, arnisSkills, powerCardsMap } from '$lib/data';
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
		<div
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4"
		>
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
		<div
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4"
		>
			{#each powerCardsMap as [key, value], idx (idx)}
				<button class="flex aspect-[1/1.3] w-40 flex-col rounded-md lg:w-60 lg:gap-1">
					<PowerCard {key} showName={false} />
					<span class="flex-auto text-sm lg:text-lg">{value.name}</span>
				</button>
			{/each}
		</div>
	</div>
</div>
