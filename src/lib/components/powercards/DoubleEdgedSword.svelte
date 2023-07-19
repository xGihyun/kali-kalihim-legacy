<script lang="ts">
	import { hamster } from '$lib/assets/images';
	import { powerCardsMap } from '$lib/data';

	export let showName: boolean = true;
	export let showDescription: boolean = false;

	const card = powerCardsMap.get('double-edged-sword');
</script>

<div class="card relative flex aspect-[1/1.3] h-full flex-col justify-end overflow-hidden">
	<img
		class="absolute left-0 top-0 z-10 h-full w-full object-cover"
		src={hamster}
		alt="hamster"
		loading="lazy"
		draggable="false"
	/>
	{#if showName}
		<div class="z-20 bg-black">
			<span class="block text-center text-base">
				{card?.name}
			</span>
		</div>
	{/if}
	{#if showDescription}
		<div
			class="z-20 flex h-full flex-col justify-end bg-gradient-to-t from-black via-black to-[transparent_50%] p-4"
		>
			<p class="text text-token text-xs opacity-75 lg:text-base">{card?.description}</p>
		</div>
	{/if}
</div>
