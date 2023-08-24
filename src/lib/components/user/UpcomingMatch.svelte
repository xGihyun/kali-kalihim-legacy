<script lang="ts">
	import type { Match, UserData } from '$lib/types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Sword } from '$lib/assets/icons';
	import RankLogo from './RankLogo.svelte';

	export let pendingMatch: Match | undefined;

	$: opponent = getContext<Writable<UserData>>('opponent');

	let initials: string;
	let stats: { name: string; value: string }[];

	$: if ($opponent) {
		initials = `${$opponent.personal_data.name.first[0]}${$opponent.personal_data.name.last[0]}`;

		stats = [
			{
				name: 'Score',
				value: $opponent?.score.toString()
			},
			{
				name: 'Overall',
				value: `#${$opponent?.rank.number.overall}`
			},
			{
				name: 'Section',
				value: `#${$opponent?.rank.number.section}`
			}
		];
	}
</script>

<div class="w-full lg:w-1/2">
	<div class="bg-surface-300-600-token border-surface-400-500-token border-token lg:rounded-md">
		<div class="flex h-20 w-full items-center gap-4 px-main">
			<Sword styles="w-8 h-8" />
			<span class="w-full text-2xl uppercase">upcoming match</span>
		</div>
		<div class="flex">
			{#if pendingMatch && $opponent}
				<div class="flex w-full flex-col gap-4">
					<div class="flex w-full flex-col">
						<div class="relative flex w-full items-center gap-4 px-main py-4">
							{#if $opponent.auth_data.banner_url}
								<img
									class="absolute left-0 top-0 z-10 h-full w-full object-cover object-center brightness-50"
									src={$opponent.auth_data.banner_url}
									role="banner"
									alt="banner"
									loading="lazy"
								/>
							{:else}
								<div class="bg-surface-300-600-token absolute left-0 top-0 z-10 h-full w-full" />
							{/if}
							<div
								class="absolute left-0 top-0 z-[11] h-full w-full bg-gradient-to-t from-black opacity-75"
							/>
							<div class="z-20 flex items-center gap-4">
								<div class="pointer-events-none relative select-none rounded-full shadow-profile">
									<Avatar
										src={$opponent.auth_data.photo_url || ''}
										width="w-16 lg:w-20"
										{initials}
									/>
								</div>
								<div class="flex flex-col">
									<a class="w-fit hover:underline" href={`/users/${$opponent.auth_data.uid}`}>
										<span class="text-base lg:text-xl">
											{$opponent.personal_data.name.first}
											{$opponent.personal_data.name.last}
										</span>
									</a>
									<div class="flex items-center gap-2">
										<RankLogo title={$opponent.rank.title} width="w-3 h-3" borderWidth="border-2" />
										<span class="text-sm uppercase opacity-75 lg:text-base">
											{$opponent.rank.title}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div class="flex h-full flex-col px-main">
							<div
								class="flex gap-1 py-4 lg:gap-2 [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md"
							>
								{#each stats as stat, idx (idx)}
									<div class="bg-surface-300-600-token flex w-40 flex-col justify-center p-2">
										<span class="text-sm lg:text-base">{stat.name}</span>
										<span
											class="text-secondary-700-200-token font-gt-walsheim-pro-medium text-lg lg:text-xl"
										>
											{stat.value}
										</span>
									</div>
								{/each}
							</div>

							<div class="flex w-full gap-2 py-4">
								<div
									class="bg-surface-300-600-token flex w-40 flex-col justify-center rounded-md p-2 shadow-lg"
								>
									<span class="text-xs uppercase lg:text-base">Skill</span>
									<span
										class="text-tertiary-600-300-token font-gt-walsheim-pro-medium text-sm lg:text-base"
									>
										{pendingMatch.skill}
									</span>
								</div>
								<div
									class="bg-surface-300-600-token flex w-40 flex-col justify-center rounded-md p-2 shadow-lg"
								>
									<span class="text-xs uppercase lg:text-base">Footwork</span>
									<span
										class="text-tertiary-600-300-token font-gt-walsheim-pro-medium text-sm lg:text-base"
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
