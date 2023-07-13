<script lang="ts">
	import type { Match, UserData } from '$lib/types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { PowerCards } from '.';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let pendingMatch: Match | undefined;
	export let opponent: UserData;
	export let initials: string;

	$: user = getContext<Writable<UserData>>('user');
</script>

<div class="flex w-full flex-col gap-2 lg:flex-row lg:px-[5%]">
	<div class="flex w-full flex-col">
		<div class="flex h-20 w-full items-center px-[5%] bg-surface-100-800-token">
			<span class="w-full text-center text-2xl uppercase">upcoming match</span>
		</div>
		<div class="flex">
			{#if pendingMatch && opponent}
				<div class="flex w-full flex-col gap-4">
					<div class="flex w-full flex-col">
						<div class="relative flex w-full items-center gap-4 p-4">
							<img
								class="absolute left-0 top-0 z-10 h-full w-full object-cover object-center brightness-50"
								src={opponent.auth_data.banner_url}
								role="banner"
								alt="banner"
								loading="lazy"
							/>
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
										<span class="text-xl">
											{opponent.personal_data.name.first}
											{opponent.personal_data.name.last}
										</span>
									</a>
									<span class="uppercase opacity-75">
										{opponent.rank.title}
									</span>
								</div>
							</div>
						</div>

						<div class="flex h-full w-full justify-center gap-4 p-4 bg-surface-100-800-token">
							<div
								class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token"
							>
								<span class="text-base">Overall</span>
								<span class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token">
									#{opponent.rank.number.overall}
								</span>
							</div>
							<div
								class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token"
							>
								<span class="text-base">Score</span>
								<span class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token">
									{opponent.score}
								</span>
							</div>
							<div
								class="flex w-40 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token"
							>
								<span class="text-base">Section</span>
								<span class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token">
									#{opponent.rank.number.section}
								</span>
							</div>
						</div>
					</div>

					<div class="flex gap-4">
						<div class="flex w-full flex-col">
							<div class="flex h-10 w-full items-center px-[5%] bg-surface-100-800-token">
								<span class="w-full text-center text-base uppercase lg:text-xl"
									>skill & footwork</span
								>
							</div>
							<div class="flex w-full flex-col justify-center gap-2 p-4">
								<div class="flex w-full flex-col justify-center rounded-md">
									<span class="text-xs uppercase lg:text-base">Skill</span>
									<span
										class="font-gt-walsheim-pro-medium text-sm text-tertiary-600-300-token lg:text-base"
									>
										{pendingMatch.skill}
									</span>
								</div>
								<div class="flex w-full flex-col justify-center rounded-md">
									<span class="text-xs uppercase lg:text-base">Footwork</span>
									<span
										class="font-gt-walsheim-pro-medium text-sm text-tertiary-600-300-token lg:text-base"
									>
										{pendingMatch.footwork}
									</span>
								</div>
							</div>
						</div>
						<!-- <div class="flex w-full flex-col">
									<div class="flex h-10 w-full items-center px-[5%] bg-surface-100-800-token">
										<span class="w-full text-center text-base uppercase lg:text-xl"
											>power cards used</span
										>
									</div>
									<div class="flex w-full flex-col justify-center rounded-md">
										{#if $opponent.power_cards.find((card) => card.activated && !card.used)}
											<div class="flex flex-col p-4">
												{#each $opponent.power_cards as card, idx (idx)}
													{#if card.activated && !card.used}
														<span
															class="font-gt-walsheim-pro-medium text-sm text-primary-600-300-token lg:text-base"
														>
															{card.name}
														</span>
													{/if}
												{/each}
											</div>
										{:else}
											<span>No power cards used</span>
										{/if}
									</div>
								</div> -->
					</div>
				</div>
			{:else}
				<span class="flex w-full justify-center opacity-50">No upcoming match</span>
			{/if}
		</div>
	</div>
	<PowerCards user={$user} />
</div>
