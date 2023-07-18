<script lang="ts">
	import type { Match, UserData } from '$lib/types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { PowerCards } from '.';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Sword } from '$lib/assets/icons';
	import RankLogo from './RankLogo.svelte';

	export let pendingMatch: Match | undefined;
	export let opponent: UserData;
	export let initials: string;

	$: user = getContext<Writable<UserData>>('user');

	const stats = [
		{
			name: 'Score',
			value: opponent?.score
		},
		{
			name: 'Overall',
			value: `#${opponent?.rank.number.overall}`
		},
		{
			name: 'Section',
			value: `#${opponent?.rank.number.section}`
		}
	];
</script>

<div class="flex w-full flex-col gap-2 lg:flex-row lg:px-[5%]">
	<div class="w-full lg:w-1/2">
		<div class="bg-surface-200-700-token border-token border-surface-400-500-token lg:rounded-md">
			<div class="flex h-20 w-full items-center gap-4 px-[5%]">
				<Sword styles="w-8 h-8" />
				<span class="w-full text-2xl uppercase">upcoming match</span>
			</div>
			<div class="flex">
				{#if pendingMatch && opponent}
					<div class="flex w-full flex-col gap-4">
						<div class="flex w-full flex-col">
							<div class="relative flex w-full items-center gap-4 px-[5%] py-4">
								{#if opponent.auth_data.banner_url}
									<img
										class="absolute left-0 top-0 z-10 h-full w-full object-cover object-center brightness-50"
										src={opponent.auth_data.banner_url}
										role="banner"
										alt="banner"
										loading="lazy"
									/>
								{:else}
									<div class="absolute left-0 top-0 z-10 h-full w-full bg-surface-300-600-token" />
								{/if}
								<div
									class="absolute left-0 top-0 z-[11] h-full w-full bg-gradient-to-t from-black opacity-75"
								/>
								<!-- <span class="font-gt-walsheim-pro-medium text-2xl uppercase">vs</span> -->
								<div class="z-20 flex items-center gap-4">
									<div class="pointer-events-none relative select-none rounded-full shadow-profile">
										<Avatar
											src={opponent.auth_data.photo_url || ''}
											width="w-16 lg:w-20"
											{initials}
										/>
									</div>
									<div class="flex flex-col">
										<a class="w-fit hover:underline" href={`/users/${opponent.auth_data.uid}`}>
											<span class="text-base lg:text-xl">
												{opponent.personal_data.name.first}
												{opponent.personal_data.name.last}
											</span>
										</a>
										<div class="flex items-center gap-2">
											<RankLogo
												title={opponent.rank.title}
												width="w-3 h-3"
												borderWidth="border-2"
											/>
											<span class="text-sm uppercase opacity-75 lg:text-base">
												{opponent.rank.title}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div class="px-[5%] h-full flex flex-col">
								<div class="flex h-full w-full justify-center gap-2 py-4 lg:gap-4">
									{#each stats as stat, idx (idx)}
										<div
											class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-400-500-token"
										>
											<span class="text-sm lg:text-base">{stat.name}</span>
											<span
												class="font-gt-walsheim-pro-medium text-lg lg:text-xl text-secondary-700-200-token"
											>
												{stat.value}
											</span>
										</div>
									{/each}
								</div>

								<div class="flex w-full justify-center gap-2 py-4">
									<div
										class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token"
									>
										<span class="text-xs uppercase lg:text-base">Skill</span>
										<span
											class="font-gt-walsheim-pro-medium text-sm text-tertiary-600-300-token lg:text-base"
										>
											{pendingMatch.skill}
										</span>
									</div>
									<div
										class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token"
									>
										<span class="text-xs uppercase lg:text-base">Footwork</span>
										<span
											class="font-gt-walsheim-pro-medium text-sm text-tertiary-600-300-token lg:text-base"
										>
											{pendingMatch.footwork}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<span class="flex w-full justify-center opacity-50">No upcoming match</span>
				{/if}
			</div>
		</div>
	</div>
	<PowerCards user={$user} />
</div>
