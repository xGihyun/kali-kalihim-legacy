<script lang="ts">
	import { rankLogoColors } from '$lib/data';

	export let title: string;
	export let width: string;
	export let absolute: boolean = false;
	export let borderWidth: string = 'border-4'
</script>

{#if absolute}
	<div class="absolute -top-[17%] left-1/2 hidden -translate-x-1/2 lg:block">
		<div class={`aspect-square rotate-45 ${borderWidth} ${width} ${rankLogoColors.get(title)}`} />
	</div>
{:else}
	<div class={`aspect-square rotate-45 ${borderWidth} ${width} ${rankLogoColors.get(title)}`} />
{/if}
