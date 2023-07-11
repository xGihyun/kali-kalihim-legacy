<script lang="ts">
	import { hamster } from '$lib/assets/images';
	import { powerCardsMap } from '$lib/data';

	export let showName: boolean;
	export let showDescription: boolean;

	const card = powerCardsMap.get('extra-wind');
</script>

<div class="card relative flex aspect-[1/1.3] h-full flex-col justify-end overflow-hidden">
	<img
		class="absolute left-0 top-0 z-10 h-full w-full object-cover"
		src={hamster}
		alt="hamster"
		loading="lazy"
		draggable="false"
	/>
	<div class="z-20 bg-black">
		<span class="text-base text-center block">
			{card?.name}
		</span>
	</div>
	{#if showDescription}
		<div
			class="z-20 flex h-full flex-col justify-end bg-gradient-to-t from-black via-black to-[transparent_50%] p-4"
		>
			<p class="text text-xs opacity-75 text-token lg:text-base">{card?.description}</p>
		</div>
	{/if}
</div>
