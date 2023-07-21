<script lang="ts">
	import { rankLogoColors } from '$lib/data';

	export let title: string;
	export let width: string;
	export let absolute: boolean = false;
	export let borderWidth: string = 'border-[6px]';
	export let zIndex: string = 'z-10';
	export let showContainer: boolean = false;
	export let containerWidth: string = 'w-20 lg:w-28';
</script>

{#if absolute}
	{#if showContainer}
		<div class="absolute -top-[14.5%] lg:-top-[13.5%] left-1/2 -translate-x-1/2">
			<div
				class={`bg-surface-200-700-token border-surface-400-500-token aspect-square rotate-45 border-l-[1px] border-t-[1px] ${containerWidth}`}
			/>
		</div>
	{/if}
	<div class={`absolute -top-[11%] left-1/2 -translate-x-1/2 lg:-top-[11.5%] ${zIndex}`}>
		<div class={`aspect-square rotate-45 ${borderWidth} ${width} ${rankLogoColors.get(title)}`} />
	</div>
{:else}
	<div class={`aspect-square rotate-45 ${borderWidth} ${width} ${rankLogoColors.get(title)}`} />
{/if}
