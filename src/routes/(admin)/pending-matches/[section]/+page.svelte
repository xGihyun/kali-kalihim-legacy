<script lang="ts">
	export let data;

	const section = data.section;
	const matchSets = data.matchSets;
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<span class="text-center text-lg">{section}</span>
	{#if matchSets}
		<div class="flex">
			{#each matchSets as matchSet, idx (idx)}
				<a class="btn variant-filled-primary" href={`${section}/${matchSet.id}`}>
					Match {matchSet.data.set}
				</a>
			{/each}
		</div>
	{/if}
</div>
