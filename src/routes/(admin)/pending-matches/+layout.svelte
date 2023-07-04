<script lang="ts">
	import { sectionsMap } from '$lib/data';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	$: section = 'Select a section';

	const sectionPopup: PopupSettings = {
		event: 'click',
		target: 'sections',
		placement: 'bottom'
	};
</script>

<div class="flex h-full w-full flex-col items-center justify-center py-10">
	<button class="btn variant-filled w-48 justify-between" use:popup={sectionPopup}>
		<span class="capitalize">{section}</span>
		<span>↓</span>
	</button>

	<div class="card w-48 py-2 shadow-xl" data-popup="sections">
		<ul>
			{#each sectionsMap as [key, value], idx (idx)}
				<li class="flex">
					<a
						class={`flex-1 px-4 py-2 ${
							section === key ? 'variant-filled' : 'bg-surface-100-800-token hover:variant-soft'
						}`}
						href={`/pending-matches/${key}`}
						on:click={() => (section = value)}>{value}</a
					>
				</li>
			{/each}
		</ul>
		<div class="arrow bg-surface-100-800-token" />
	</div>
	<div class="flex h-full w-full flex-col items-center justify-center">
		<slot />
	</div>
</div>
