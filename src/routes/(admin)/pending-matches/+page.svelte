<script lang="ts">
	import { sections } from '$lib/data';

</script>

<div class="h-full w-full flex flex-col justify-center items-center px-[5%]">
	{#each sections as [key, value], idx (idx)}
		<a class="btn variant-soft-secondary" href={`pending-matches/${key}`}>{value}</a>
	{/each}
</div>
