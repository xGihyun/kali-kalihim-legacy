<script>
	import { arnisFootworks, arnisSkills } from '$lib/data';
</script>

<div class="flex h-full w-full flex-col items-center px-[5%] py-10">
	<!-- <div>This is where Arnis tutorial videos will be found maybe? (WIP)</div> -->
	<div class="mb-4">
		<h2 class="font-gt-walsheim-pro-medium text-xl">Skills</h2>
		<div class="logo-cloud grid-cols-2 gap-0.5 md:grid-cols-3 lg:grid-cols-4">
			{#each arnisSkills as video, idx (idx)}
				<a class="logo-item w-40" href={video.url} target="_blank" rel="noreferrer">
					<div class="h-full w-full p-2 text-center">
						<span class="flex-auto lg:text-base text-sm">{video.title}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
	<div class="mb-4">
		<h2 class="font-gt-walsheim-pro-medium text-xl">Footwork</h2>
		<div class="logo-cloud grid-cols-2 gap-0.5 md:grid-cols-3 lg:grid-cols-4">
			{#each arnisFootworks as video, idx (idx)}
				<a class="logo-item w-40" href={video.url} target="_blank" rel="noreferrer">
					<div class="h-full w-full p-2 text-center">
						<span class="flex-auto lg:text-base text-sm">{video.title}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
