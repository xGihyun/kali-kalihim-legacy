<script lang="ts">
	import { powerCardsMap } from '$lib/data';
	import { selectedPowerCard } from '$lib/store';
	import {
		AncientsProtection,
		DoubleEdgedSword,
		ExtraWind,
		TwistOfFate,
		ViralxRival,
		WarlordsDomain
	} from './powercards';
</script>

{#if $selectedPowerCard !== null}
	<div class="bg-surface-backdrop-token fixed left-0 top-0 z-[999] h-full w-full">
		<div class="flex h-full w-full items-center justify-center">
			<div class="bg-surface-100-800-token rounded-container-token w-modal space-y-4 p-4 shadow-xl">
				{#if $selectedPowerCard === "warlord's-domain"}
					<WarlordsDomain />
				{:else if $selectedPowerCard === 'double-edged-sword'}
					<DoubleEdgedSword />
				{:else if $selectedPowerCard === 'extra-wind'}
					<ExtraWind />
				{:else if $selectedPowerCard === "ancient's-protection"}
					<AncientsProtection />
				{:else if $selectedPowerCard === 'viral-x-rival'}
					<ViralxRival />
				{:else if $selectedPowerCard === 'twist-of-fate'}
					<TwistOfFate />
				{/if}
				<div class="flex justify-end gap-4">
					Would you like to use {powerCardsMap.get($selectedPowerCard)} ?
					<button
						class="btn variant-ghost-surface"
						type="button"
						on:click={() => ($selectedPowerCard = null)}>No</button
					>
					<button class="variant-filled-primary btn" type="submit">Yes</button>
				</div>
			</div>
		</div>
	</div>
{/if}
