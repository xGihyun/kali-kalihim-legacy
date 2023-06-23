<script lang="ts">
	import { page } from '$app/stores';
	import { sectionMap } from '$lib/data.js';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	
	export let data;

	$: section = data.section;
	$: matchSets = data.matchSets;
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<span class="text-center text-lg">{sectionMap.get(section)}</span>
	{#if matchSets}
		<TabGroup justify="justify-center" active="border-b-2 border-primary-400-500-token" hover="hover:variant-soft-primary">
			{#each matchSets as matchSet, idx (idx)}
				<TabAnchor href={`/pending-matches/${section}/${matchSet.id}`} selected={$page.url.pathname === `/pending-matches/${section}/${matchSet.id}`}>
					Match {matchSet.data.set}
				</TabAnchor>
			{/each}
		</TabGroup>
		<!-- <div class="flex">
			{#each matchSets as matchSet, idx (idx)}
				<a class="btn variant-filled-primary" href={`/pending-matches/${section}/${matchSet.id}`}>
					Match {matchSet.data.set}
				</a>
			{/each}
		</div> -->
		<div class="flex h-full w-full flex-col items-center justify-center">
			<slot />
		</div>
	{/if}
</div>
