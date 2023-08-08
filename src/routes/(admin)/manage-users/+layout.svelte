<script lang="ts">
	import { getSections } from '$lib/utils/functions';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	$: selectedSection = 'Select a section';

	const sectionPopup: PopupSettings = {
		event: 'click',
		target: 'sections',
		placement: 'bottom'
	};

	// NOTE: Make it reactive, maybe store sections in a writable

	// const sectionsCollection = collection(db, 'sections');

	// const unsubSections = onSnapshot(sectionsCollection, (snapshot) => {
	// 	snapshot.docs.map((section) => {
	// 		const sectionData = section.data() as Section;
	// 		const value = sectionData.name;
	// 		const key = section.id;

	// 		sections.update((map) => map.set(key, value));
	// 	});
	// });

	// onDestroy(() => unsubSections());
</script>

<div class="flex h-full w-full flex-col items-center justify-center py-10">
	<button class="btn variant-filled w-48 justify-between" use:popup={sectionPopup}>
		<span class="capitalize">{selectedSection}</span>
		<span>↓</span>
	</button>

	<div class="card z-20 w-48 py-2 shadow-xl" data-popup="sections">
		<ul>
			{#await getSections()}
				<span>Loading sections...</span>
			{:then sections}
				{#each sections as section, idx (idx)}
					<li class="flex">
						<a
							class={`flex-1 px-4 py-2 ${
								selectedSection === section.id
									? 'variant-filled'
									: 'bg-surface-100-800-token hover:variant-soft'
							}`}
							href={`/manage-users/${section.id}`}
							on:click={() => (selectedSection = section.id)}>{section.id}</a
						>
					</li>
				{/each}
			{/await}
		</ul>
		<div class="arrow bg-surface-100-800-token" />
	</div>
	<div class="flex h-full w-full flex-col items-center justify-center gap-4">
		<slot />
	</div>
</div>
