<section class="card max-w-5xl w-full">
	<div class="p-4 space-y-4">
		<div class="placeholder h-10 animate-pulse"></div>

		{#each { length: 5 } as _, idx (idx)}
			<div class="grid grid-cols-4 gap-4">
				{#each { length: 4 } as _, idx (idx)}
					<div class="placeholder h-6 animate-pulse" />
				{/each}
			</div>
		{/each}
	</div>
</section>
