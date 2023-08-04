<script lang="ts">
	import { Arnis } from '$lib/components/match';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let data;

	$: ({ matchSets, section, sections } = data);
	$: selectedSection = section;

	const sectionPopup: PopupSettings = {
		event: 'click',
		target: 'sections',
		placement: 'bottom'
	};
</script>

<div class="flex h-full w-full flex-col items-center justify-center py-10">
	<button class="btn variant-filled w-48 justify-between" use:popup={sectionPopup}>
		<span class="capitalize">{selectedSection}</span>
		<span>↓</span>
	</button>
</div>

<div class="card w-48 py-2 shadow-xl" data-popup="sections">
	<ul>
		{#each sections as section, idx (idx)}
			<li class="flex">
				<a
					href={`/pending-matches/${selectedSection}`}
					class={`flex-1 px-4 py-2`}
					on:click={() => {
						selectedSection = section.id;
						// test();
					}}>{section.name}</a
				>
			</li>
		{/each}
	</ul>
	<div class="arrow bg-surface-100-800-token" />
</div>
<Arnis {matchSets} />
