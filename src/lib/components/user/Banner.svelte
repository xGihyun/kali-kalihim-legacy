<script lang="ts">
	import { Edit } from '$lib/assets/icons';
	import { crop } from '$lib/pkg/my_package';
	import type { UserData } from '$lib/types';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	$: user = getContext<Writable<UserData>>('user');

	let uploadBannerEl: HTMLInputElement;
	let selectedBanner: File | null = null;

	const popupChangeBanner: PopupSettings = {
		event: 'click',
		target: 'banner',
		placement: 'bottom'
	};

	const BANNER = {
		width: 1920,
		height: 320
	};

	async function handleBannerUpload() {
		if (!selectedBanner) return;

		const formData = new FormData();

		const bannerArrayBuffer = await selectedBanner.arrayBuffer();
		const bannerBytes = new Uint8Array(bannerArrayBuffer);
		const croppedBannerBytes = crop(bannerBytes, BANNER.width, BANNER.height);

		formData.append('blob', new Blob([croppedBannerBytes]));
		formData.append('file_name', selectedBanner.name);

		const response = await fetch('./api/banner/upload', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			console.log('Successfully changed banner.');
		} else {
			console.error('Error changing banner.');
		}
	}

	function handleSelectedBanner(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) return;

		selectedBanner = target.files[0];

		handleBannerUpload();
	}

	async function removeBanner() {
		if (!$user.auth_data.photo_url) return;

		const response = await fetch('./api/banner/remove', {
			method: 'POST'
		});

		if (response.ok) {
			console.log('Successfully removed banner.');
		} else {
			console.error('Error removing banner.');
		}
	}
</script>

<div class="relative h-40 w-full lg:h-80">
	{#if $user.auth_data.banner_url}
		<img
			class="h-full w-full object-cover object-center"
			src={$user.auth_data.banner_url}
			role="banner"
			alt="banner"
			loading="lazy"
		/>
	{:else}
		<div class="h-40 bg-surface-300-600-token lg:h-80" />
	{/if}
	<button
		class="absolute bottom-2 right-5 rounded-full p-2 shadow-profile transition-[background-color] duration-100 bg-surface-300-600-token hover:bg-surface-500-400-token"
		use:popup={popupChangeBanner}
	>
		<Edit styles="w-5 h-5" />
	</button>
	<div class="card z-20 w-40 py-2 shadow-xl transition-none duration-0" data-popup="banner">
		<input
			type="file"
			accept="image/*"
			name="banner"
			hidden
			on:change={handleSelectedBanner}
			bind:this={uploadBannerEl}
		/>
		<button
			class="w-full px-2 py-1 hover:bg-surface-400-500-token"
			on:click={() => uploadBannerEl.click()}
		>
			<span class="text-base">Change banner</span>
		</button>
		<button class="w-full px-2 py-1 hover:bg-surface-400-500-token" on:click={removeBanner}>
			<span class="text-base">Remove banner</span>
		</button>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</div>
