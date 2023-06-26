<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { currentUser } from '$lib/store';
	import { setContext } from 'svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Navbar } from '$lib/components';

	export let data;

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	$: currentUser.set({
		auth_data: {
			email: data.user?.auth_data.email || '',
			is_logged_in: data.user?.auth_data.is_logged_in || false,
			is_registered: data.user?.auth_data.is_registered || false,
			photo_url: data.user?.auth_data.photo_url || '',
			uid: data.user?.auth_data.uid || '',
			username: data.user?.auth_data.username || '',
			role: data.user?.auth_data.role || ''
		},
		personal_data: {
			age: data.user?.personal_data.age || -1,
			contact_number: data.user?.personal_data.contact_number || -1,
			name: {
				first: data.user?.personal_data.name.first || '',
				last: data.user?.personal_data.name.last || ''
			},
			section: data.user?.personal_data.section || '',
			sex: data.user?.personal_data.sex || ''
		},
		score: data.user?.score || 0,
		rank: {
			number: {
				overall: data.user?.rank.number.overall || 0,
				section: data.user?.rank.number.section || 0
			},
			title: data.user?.rank.title || ''
		}
	});

	setContext('user', currentUser);
</script>

<div class="flex h-screen w-full flex-col overflow-hidden">
	<Navbar />
	<div class="flex h-full w-full flex-auto overflow-hidden">
		<main class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
			<div class="flex flex-1 flex-col items-center justify-center px-[5%] py-10">
				<slot />
			</div>
		</main>
	</div>
</div>
