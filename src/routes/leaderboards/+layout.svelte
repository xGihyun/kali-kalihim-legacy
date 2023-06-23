<script>
	import { sections } from '$lib/data';

	$: section = 'section-1';
</script>

<label class="label">
	<span>Section</span>
	<select class="input" size="1" name="section" required bind:value={section}>
		{#each sections as [key, value], idx (idx)}
			<option value={key}>{value}</option>
		{/each}
	</select>
</label>

<div class="flex h-full w-full flex-col items-center justify-center">
	<slot />
</div>
