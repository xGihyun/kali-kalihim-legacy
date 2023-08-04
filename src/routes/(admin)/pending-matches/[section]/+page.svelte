<script lang="ts">
	import { Arnis } from '$lib/components/match';

	export let data;

	$: ({ matchSets } = data);
</script>

<!-- {#each matchSets as matchSet, idx (idx)}
	<button
		class="btn variant-filled"
		on:click={() => {
			// matchSetId = matchSet.id;
			// matchesResult = getMatch(matchSetId);
		}}
	>
		Match {matchSet.data.set}
	</button>
{/each} -->

<Arnis {matchSets} />
