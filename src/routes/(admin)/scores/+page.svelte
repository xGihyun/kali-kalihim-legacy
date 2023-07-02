<script lang="ts">
	import { sectionsMap } from '$lib/data';
</script>

<div class="flex h-full w-full flex-col items-center justify-center px-[5%]">
	{#each sectionsMap as [key, value], idx (idx)}
		<a class="btn variant-soft-secondary" href={`scores/${key}`}>{value}</a>
	{/each}
</div>
