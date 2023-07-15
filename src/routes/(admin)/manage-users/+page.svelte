<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { doc, setDoc } from 'firebase/firestore';

	let section: string;

	async function addSection() {
		if (!section) {
			console.error('Invalid input');
			return;
		}

		const key = section.toLowerCase().trim();
		const value = key.charAt(0).toUpperCase() + key.slice(1);
		const sectionRef = doc(db, 'sections', key);

		await setDoc(sectionRef, { name: value });

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
