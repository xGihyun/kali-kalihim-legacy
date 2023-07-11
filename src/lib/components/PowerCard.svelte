<script lang="ts">
	import { powerCardsMap } from '$lib/data';
	import { selectedPowerCard } from '$lib/store';

	$: powerCard = powerCardsMap.get($selectedPowerCard || '');

	function confirmPowerCard() {
		if (powerCard) {
			powerCard.used = true;
		}
	}

	function cancelPowerCard() {
		if (powerCard) {
			powerCard.used = false;
		}
		$selectedPowerCard = null;
	}
</script>

{#if $selectedPowerCard && powerCard}
	<div class="fixed left-0 top-0 z-[999] h-full w-full bg-surface-backdrop-token">
		<div class="flex h-full w-full items-center justify-center p-2">
			<div class="w-modal space-y-4 p-4 shadow-xl bg-surface-100-800-token rounded-container-token">
				{#if powerCard.used}
					<span>{powerCard.name}</span>
					<div class="space-y-4">
						<svelte:component this={powerCard.components.ability} />
					</div>
				{:else}
					<div class="card mx-auto aspect-[1/1.3] w-1/2 p-4">
						<svelte:component this={powerCard.components.card} />
					</div>
					<div class="flex flex-col gap-4">
						<span class="text-center">
							Would you like to use
							<span class="font-bold">
								{powerCard.name}
							</span>
							?
						</span>
						<div class="flex justify-end gap-4">
							<button class="btn variant-ghost-surface" type="button" on:click={cancelPowerCard}>
								No
							</button>
							<button
								class="btn variant-filled-primary"
								type="button"
								on:click={confirmPowerCard}
								data-sveltekit-preload-code="hover"
							>
								Yes
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
