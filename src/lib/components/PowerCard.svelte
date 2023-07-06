<script lang="ts">
	import { powerCardsMap } from '$lib/data';
	import { selectedPowerCard } from '$lib/store';

	$: powerCard = powerCardsMap.get($selectedPowerCard || '');

	function confirmPowerCard() {
		if (powerCard) {
			powerCard.used = true;
			console.log(powerCard.name)
		}
	}

	function cancelPowerCard() {
		$selectedPowerCard = null;
	}
</script>

{#if $selectedPowerCard && powerCard}
	<div class="bg-surface-backdrop-token fixed left-0 top-0 z-[999] h-full w-full">
		<div class="flex h-full w-full items-center justify-center p-2">
			<div class="bg-surface-100-800-token rounded-container-token w-modal space-y-4 p-4 shadow-xl">
				{#if powerCard.used}
					<div>{powerCard.name}</div>
					<div>
						<svelte:component this={powerCard.components.ability} />
					</div>
					<!-- Temporary cancel button -->
					<button class="btn variant-ghost-surface" type="button" on:click={cancelPowerCard}>
						Cancel
					</button>
				{:else}
					<div class="card mx-auto aspect-[1/1.3] w-1/2 p-4">
						<svelte:component this={powerCard.components.card} />
					</div>
					<div class="flex flex-col gap-4">
						<span class="text-center">
							Would you like to use {powerCard.name} ?
						</span>
						<div class="flex justify-end gap-4">
							<button class="btn variant-ghost-surface" type="button" on:click={cancelPowerCard}>
								No
							</button>
							<button
								class="variant-filled-primary btn"
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
