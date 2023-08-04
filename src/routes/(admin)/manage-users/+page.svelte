<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import type { Section } from '$lib/types';
	import { doc, setDoc } from 'firebase/firestore';

	let section: string = '';

	async function addSection() {
		if (!section) {
			console.error('Invalid input');
			return;
		}

		const key = section.toLowerCase().trim().replace(' ', '_');
		const value = section.charAt(0).toUpperCase() + section.slice(1);
		const sectionRef = doc(db, 'sections', key);
		const data: Section = {
			name: value,
			id: key
		};

		await setDoc(sectionRef, { ...data });

		section = '';
	}
</script>

<div class="z-10 w-full max-w-sm">
	<div class="flex flex-col">
		<span>Add a section</span>
		<span class="text-sm opacity-75">Only input the section name. (eg. agatha)</span>
	</div>
	<form class="w-full" on:submit|preventDefault={addSection}>
		<input class="input variant-form-material w-2/3" type="text" bind:value={section} />
		<button class="btn-icon variant-ghost-primary">+</button>
	</form>
</div>
