<script lang="ts">
	import { page } from '$app/stores';
	import { Plus } from '$lib/assets/icons';
	import ChevronUp from '$lib/assets/icons/ChevronUp.svelte';
	import { db } from '$lib/firebase/firebase.js';
	import type { Section } from '$lib/types.js';
	import { getStudentCountInSection } from '$lib/utils/functions.js';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	export let data;

	$: ({ sections } = data);

	$: selectedSection = 'Select a section';

	let newSection = '';

	const sectionPopup: PopupSettings = {
		event: 'click',
		target: 'sections',
		placement: 'top'
	};

	$: isSelectedSection = (section: string) => {
		const currentParam = $page.params.section;

		const isSelected = currentParam === section;

		return isSelected;
	};

	async function addSection(): Promise<void> {
		if (!newSection) {
			console.error('Invalid input');
			return;
		}

		const formData = new FormData();

		formData.append('section', newSection);

		const response = await fetch('./api/section', {
			method: 'POST',
			body: formData
		});

		newSection = '';

		if (!response.ok) {
			throw new Error('Failed to add section.');
		}
	}

	// NOTE: Make it reactive, maybe store sections in a writable

	const sectionsCollection = collection(db, 'sections');

	const unsubSections = onSnapshot(sectionsCollection, async (snapshot) => {
		sections = await Promise.all(
			snapshot.docs.map(async (section) => {
				const sectionData = section.data() as Section;
				const studentCount = await getStudentCountInSection(sectionData);
				const newSectionData: Section = {
					count: studentCount,
					...sectionData
				};

				return newSectionData;
			})
		);

		console.log('Section snapshot');
	});

	onDestroy(() => unsubSections());
</script>

<!-- For desktop -->
<div class="flex h-full w-full gap-4 pb-16 lg:pb-0 lg:pt-0 pt-10">
	<div class="flex flex-col items-center gap-4 w-full">
		<slot />
	</div>

	<div
		class="w-full max-w-xs h-full bg-gradient-to-bl from-surface-500 to-surface-800 p-4 rounded-md lg:flex gap-4 hidden relative justify-between flex-col"
	>
		<div>
			<span class="w-full text-2xl p-2">Sections</span>
			<div class="text-left text-xs lg:text-sm opacity-75 p-2 w-full flex">
				<span class="w-full">Name</span>
				<span class="w-1/3">Count</span>
			</div>

			<ul class="list-none">
				{#each sections as section, idx (idx)}
					<li class="p-2">
						<a
							class={`w-full flex ${
								isSelectedSection(section.id) ? 'text-tertiary-500' : 'text-white'
							} `}
							href={`/manage-users/${section.id}`}
						>
							<span class="w-full">{section.name}</span>
							<span class="w-1/3">{section.count}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex flex-col gap-1">
			<span class="text-sm opacity-75">Only input the section name. (eg. agatha)</span>
			<form class="w-full flex gap-2" on:submit|preventDefault={addSection}>
				<input
					class="bg-surface-700 focus:outline-none focus-within:outline-none focus-visible:outline-none border-none border-primary-500 rounded-md"
					type="text"
					placeholder="Add a new section"
					bind:value={newSection}
				/>
				<button class="variant-filled-primary h-full flex px-3 py-2 rounded-md" type="submit">
					<Plus styles="w-5 h-5" />
				</button>
			</form>
		</div>
	</div>
</div>

<!-- Dropdown for mobile -->
<div
	class="flex flex-col gap-4 justify-between rounded-md bg-surface-200-700-token sticky bottom-0 lg:hidden left-0 w-full px-main py-2"
>
	<button
		class="flex justify-between items-center bg-surface-800 px-2 py-1 rounded-md w-full gap-4"
		use:popup={sectionPopup}
	>
		<span class="capitalize">{selectedSection}</span>
		<ChevronUp styles="w-5 h-5" />
	</button>

	<form class="w-full flex gap-2" on:submit|preventDefault={addSection}>
		<input
			class="w-full bg-surface-800 focus:outline-none focus-within:outline-none focus-visible:outline-none border-none border-primary-500 rounded-md"
			type="text"
			placeholder="Add a new section (eg. agatha)"
			bind:value={newSection}
		/>
		<button class="variant-filled-primary h-full flex px-3 py-2 rounded-md" type="submit">
			<Plus styles="w-5 h-5" />
		</button>
	</form>
</div>

<div class="card z-20 w-48 py-2 shadow-xl" data-popup="sections">
	<ul>
		{#each sections as section, idx (idx)}
			<li class="flex">
				<a
					class={`flex-1 px-4 py-2 ${
						selectedSection === section.id
							? 'variant-filled'
							: 'bg-surface-100-800-token hover:variant-soft'
					}`}
					href={`/manage-users/${section.id}`}
					on:click={() => (selectedSection = section.id)}>{section.name}</a
				>
			</li>
		{/each}
	</ul>
	<div class="arrow bg-surface-100-800-token" />
</div>
