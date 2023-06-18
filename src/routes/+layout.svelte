<script lang="ts">
	// import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { currentUser } from '$lib/store';
	import { setContext } from 'svelte';
	import { Navbar } from '../components';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

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
		score: data.user?.score || 0
	});

	setContext('user', currentUser);
</script>

<Navbar notifications={data.notifications || []} />
<main class="h-screen">
	<slot />
</main>
