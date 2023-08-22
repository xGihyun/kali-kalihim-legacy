<script lang="ts">
	import { getSections } from '$lib/utils/functions';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	$: selectedSection = 'All';

	export let data;

	$: ({ sections } = data);

	const sectionPopup: PopupSettings = {
		event: 'click',
		target: 'sections',
		placement: 'bottom'
	};
</script>

<div class="flex flex-1 flex-col items-center justify-center w-full px-main py-10">
	<button class="btn variant-filled w-48 justify-between mb-5" use:popup={sectionPopup}>
		<span class="capitalize">{selectedSection}</span>
		<span>↓</span>
	</button>

	<div class="card w-48 py-2 shadow-xl" data-popup="sections">
		<ul>
			<li class="flex">
				<a
					class={`flex-1 px-4 py-2 ${
						selectedSection === 'All'
							? 'variant-filled'
							: 'bg-surface-100-800-token hover:variant-soft'
					}`}
					href="/leaderboards"
					on:click={() => (selectedSection = 'All')}>All</a
				>
			</li>
			<!-- {#await getSections()} -->
			<!-- 	<span>Loading sections...</span> -->
			<!-- {:then sections} -->
			{#each sections as section, idx (idx)}
				<li class="flex">
					<a
						class={`flex-1 px-4 py-2 ${
							selectedSection === section.id
								? 'variant-filled'
								: 'bg-surface-100-800-token hover:variant-soft'
						}`}
						href={`/leaderboards/${section.id}`}
						on:click={() => (selectedSection = section.id)}>{section.name}</a
					>
				</li>
			{/each}
			<!-- {/await} -->
		</ul>
		<div class="arrow bg-surface-100-800-token" />
	</div>

	<div class="flex h-full w-full flex-col items-center justify-center">
		<slot />
	</div>
</div>
