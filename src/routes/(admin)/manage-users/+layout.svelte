<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { sections } from '$lib/store';
	import type { Section } from '$lib/types';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	$: section = 'Select a section';

	const sectionsMap = getContext<Writable<Map<string, string>>>('sections');

	const sectionPopup: PopupSettings = {
		event: 'click',
		target: 'sections',
		placement: 'bottom'
	};

	const sectionsCollection = collection(db, 'sections');

	const unsubSections = onSnapshot(sectionsCollection, (snapshot) => {
		snapshot.docs.map((section) => {
			const sectionData = section.data() as Section;
			const value = sectionData.name;
			const key = section.id;

			sections.update((map) => map.set(key, value));
		});
	});

	onDestroy(() => unsubSections());
</script>

<div class="flex h-full w-full flex-col items-center justify-center py-10">
	<button class="btn variant-filled w-48 justify-between" use:popup={sectionPopup}>
		<span class="capitalize">{section}</span>
		<span>↓</span>
	</button>

	<div class="card z-20 w-48 py-2 shadow-xl" data-popup="sections">
		<ul>
			{#each $sectionsMap as [key, value], idx (idx)}
				<li class="flex">
					<a
						class={`flex-1 px-4 py-2 ${
							section === key ? 'variant-filled' : 'bg-surface-100-800-token hover:variant-soft'
						}`}
						href={`/manage-users/${key}`}
						on:click={() => (section = value)}>{value}</a
					>
				</li>
			{/each}
		</ul>
		<div class="arrow bg-surface-100-800-token" />
	</div>
	<div class="flex h-full w-full flex-col items-center justify-center gap-4">
		<slot />
	</div>
</div>
