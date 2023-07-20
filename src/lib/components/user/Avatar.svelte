<script lang="ts">
	import { crop } from '$lib/pkg/my_package';
	import type { UserData } from '$lib/types';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { doc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { currentUser } from '$lib/store';

	export let initials: string;

	$: user = getContext<Writable<UserData>>('user');
	$: sectionsMap = getContext<Writable<Map<string, string>>>('sections');

	let selectedAvatar: File | null = null;
	let uploadAvatarEl: HTMLInputElement;

	const popupChangeAvatar: PopupSettings = {
		event: 'click',
		target: 'avatar',
		placement: 'bottom'
	};

	const AVATAR = {
		width: 160,
		height: 160
	};

	async function handleFileUpload() {
		if (!selectedAvatar) return;

		const formData = new FormData();

		const bannerArrayBuffer = await selectedAvatar.arrayBuffer();
		const bannerBytes = new Uint8Array(bannerArrayBuffer);
		const croppedBannerBytes = crop(bannerBytes, AVATAR.width, AVATAR.height);

		formData.append('blob', new Blob([croppedBannerBytes]));
		formData.append('file_name', selectedAvatar.name);

		const response = await fetch('./api/photo/upload', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			console.log('Successfully changed profile picture.');
		} else {
			console.error('Error changing profile picture.');
		}
	}

	async function removeAvatar() {
		if (!$user.auth_data.photo_url) return;

		const response = await fetch('./api/photo/remove', {
			method: 'POST'
		});

		if (response.ok) {
			console.log('Successfully removed profile picture.');
		} else {
			console.error('Error removing profile picture.');
		}
	}

	function handleSelectedAvatar(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) return;

		selectedAvatar = target.files[0];

		handleFileUpload();
	}

	async function togglePrivate() {
		currentUser.update((val) => (val = { ...val, is_private: !val.is_private }));

		const userRef = doc(db, 'users', $user.auth_data.uid);

		await updateDoc(userRef, { is_private: $user.is_private });
	}
</script>

<div class="flex h-28 lg:h-32 w-full items-center gap-4 px-main bg-surface-200-700-token mb-20 lg:mb-28">
	<div class="flex h-full w-full items-center gap-4">
		<button
			class="flex h-16 w-16 rounded-full shadow-profile lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end"
			title="Change your avatar!"
			use:popup={popupChangeAvatar}
		>
			<Avatar src={$user.auth_data.photo_url || ''} width="w-20 lg:w-40" {initials} />
		</button>
		<div class="card z-20 w-40 py-2 shadow-xl transition-none duration-0" data-popup="avatar">
			<button
				class="w-full px-2 py-1 hover:bg-surface-400-500-token"
				on:click={() => uploadAvatarEl.click()}
			>
				<span class="text-base">Change avatar</span>
			</button>
			<button class="w-full px-2 py-1 hover:bg-surface-400-500-token" on:click={removeAvatar}>
				<span class="text-base">Remove avatar</span>
			</button>
			<div class="arrow bg-surface-100-800-token" />
		</div>
		<input
			type="file"
			accept="image/*"
			name="photo"
			hidden
			on:change={handleSelectedAvatar}
			bind:this={uploadAvatarEl}
		/>
		<div class="flex h-full flex-col justify-center">
			<span class="text-base lg:text-2xl">
				{$user.personal_data.name.first}
				{$user.personal_data.name.last}
			</span>
			<span class="text-sm text-secondary-700-200-token lg:text-lg">
				St. {$sectionsMap.get($user.personal_data.section)}
			</span>
		</div>
	</div>
	<div class="flex flex-col items-center justify-center">
		<SlideToggle
			name="private"
			bind:checked={$user.is_private}
			active="bg-primary-500"
			background="bg-surface-100-800-token"
			size="sm"
			on:click={togglePrivate}
		/>
		<span class="text-sm opacity-75">Private</span>
	</div>
</div>
