<script lang="ts">
	import type { UserData } from '$lib/types';
	import { RankLogo } from '.';

	export let user: UserData;

	let stats: { name: string; value: string }[];

	$: if (user) {
		stats = [
			{
				name: 'Score',
				value: user?.score.toString()
			},
			{
				name: 'Overall',
				value: `#${user?.rank.number.overall}`
			},
			{
				name: 'Section',
				value: `#${user?.rank.number.section}`
			}
		];
	}
</script>

<div class="relative w-full lg:px-main">
	<div
		class="bg-surface-200-700-token border-surface-400-500-token relative h-16 rounded-md border-token lg:h-20"
	/>
	<RankLogo title={user.rank.title} width="lg:w-24 w-16" absolute={true} showContainer={true} />
	<div class="flex justify-center">
		<div
			class="relative z-[1] flex h-36 w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-blue-950 to-rose-950 lg:h-64 lg:w-[95%]"
		>
			<span
				class="text-outline absolute left-1/2 z-10 w-full -translate-x-1/2 select-none text-start font-gt-walsheim-pro-medium text-[10rem] uppercase tracking-wide opacity-20 lg:text-center lg:text-[12rem]"
			>
				{user.rank.title}
			</span>
		</div>
	</div>
	<div class="absolute bottom-2 left-1/2 z-30 w-full -translate-x-1/2 px-main">
		<div class="flex justify-center [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md">
			{#each stats as stat, idx (idx)}
				<div class="bg-surface-200-700-token flex w-40 flex-col justify-center p-2 lg:w-60 lg:p-4">
					<span class="text-sm lg:text-xl">{stat.name}</span>
					<span
						class="text-secondary-700-200-token font-gt-walsheim-pro-medium text-lg lg:text-3xl"
					>
						{stat.value}
					</span>
				</div>
			{/each}
		</div>
	</div>
	<div
		class="bg-surface-200-700-token border-surface-400-500-token relative h-16 rounded-md border-token lg:h-20"
	/>
	<!-- <div class="bg-surface-200-700-token relative rounded-md py-4 lg:px-4">
		<div class="absolute -top-[17.5%] left-1/2 -translate-x-1/2">
			<div class="bg-surface-200-700-token aspect-square w-28 rotate-45" />
		</div>

		<RankLogo title={user.rank.title} width="lg:w-24 w-16" absolute={true} />

		<div
			class="relative z-[1] flex h-36 w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-blue-950 to-rose-950 lg:h-72"
		>
			<span
				class="text-outline absolute left-1/2 z-10 w-full -translate-x-1/2 select-none text-start font-gt-walsheim-pro-medium text-[10rem] uppercase tracking-wide opacity-20 lg:text-center lg:text-[12rem]"
			>
				{user.rank.title}
			</span>
		</div>
		<div class="absolute -bottom-[12%] left-1/2 z-30 w-full -translate-x-1/2 px-main">
			<div
				class="flex justify-center gap-1 lg:gap-2 [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md"
			>
				{#each stats as stat, idx (idx)}
					<div
						class="bg-surface-200-700-token flex w-40 flex-col justify-center p-2 lg:w-60 lg:p-4"
					>
						<span class="text-sm lg:text-xl">{stat.name}</span>
						<span
							class="text-secondary-700-200-token font-gt-walsheim-pro-medium text-lg lg:text-3xl"
						>
							{stat.value}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div> -->
</div>

<style>
	.text-outline {
		color: white;
		-webkit-text-fill-color: transparent;
		-webkit-text-stroke-width: 1px;
		/* -webkit-background-clip: text; */
		/* background-clip: text; */
	}
</style>
