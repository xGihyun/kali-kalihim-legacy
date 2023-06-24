<script lang="ts">
	import { page } from '$app/stores';
	import { sectionMap } from '$lib/data.js';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';

	export let data;

	$: section = data.section;
	$: matchSets = data.matchSets;
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<h1 class="text-center text-2xl uppercase font-gt-walsheim-pro-medium mb-5">{sectionMap.get(section)}</h1>
	{#if matchSets}
		<TabGroup justify="justify-center">
			{#each matchSets as matchSet, idx (idx)}
				<TabAnchor
					href={`/pending-matches/${section}/${matchSet.id}`}
					selected={$page.url.pathname === `/pending-matches/${section}/${matchSet.id}`}
				>
					Match {matchSet.data.set}
				</TabAnchor>
			{/each}
		</TabGroup>
		<div class="flex h-full w-full flex-col items-center justify-center">
			<slot />
		</div>
	{/if}
</div>
