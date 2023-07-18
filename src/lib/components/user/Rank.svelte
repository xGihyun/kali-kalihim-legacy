<script lang="ts">
	import type { UserData } from '$lib/types';
	import { RankLogo } from '.';

	export let user: UserData;

	const stats = [
		{
			name: 'Score',
			value: user.score
		},
		{
			name: 'Overall',
			value: `#${user.rank.number.overall}`
		},
		{
			name: 'Section',
			value: `#${user.rank.number.section}`
		}
	];
</script>

<div
	class="relative z-[1] flex h-36 w-full flex-col items-center justify-center bg-gradient-to-r from-blue-950 to-rose-950 px-[5%] py-2 lg:h-72"
>
	<RankLogo title={user.rank.title} width="lg:w-24" absolute={true} />
	<span
		class="text-outline w-full select-none text-start font-gt-walsheim-pro-medium text-[10rem] uppercase tracking-wide opacity-20 lg:text-center lg:text-[12rem]"
	>
		{user.rank.title}
	</span>
</div>
<div class="z-10 flex h-16 w-full px-[5%] lg:h-20">
	<div class="mb-8 w-full flex-none self-end">
		<div class="flex w-full justify-center gap-2 lg:gap-4">
			{#each stats as stat, idx (idx)}
				<div
					class="flex w-60 flex-col justify-center rounded-md p-2 shadow-lg bg-surface-300-600-token lg:p-4"
				>
					<span class="text-base lg:text-xl">{stat.name}</span>
					<span
						class="font-gt-walsheim-pro-medium text-xl text-secondary-700-200-token lg:text-3xl"
					>
						{stat.value}
					</span>
				</div>
			{/each}
		</div>
	</div>
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
