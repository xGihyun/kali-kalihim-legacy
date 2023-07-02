<script lang="ts">
	import { sectionsMap } from '$lib/data.js';

	export let data;

	$: users = data.users;
  $: section = data.section;
</script>

<div class="table-container max-w-5xl">
	<table class="table-compact table-hover table">
		<thead>
			<tr>
				<th class="text-sm md:text-base">Name</th>
				<th class="text-sm md:text-base">Section</th>
				<th class="text-sm md:text-base">Rating</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user, idx (idx)}
				<tr class="text-secondary-700-200-token">
					<td>
						<p class="text-xs md:text-sm">
							<span class="font-bold text-token">#{idx + 1}</span>
							<a class="hover:underline" href={`/scores/${section}/${user.auth_data.uid}`}>
								<span>
									{user.personal_data.name.first}
									{user.personal_data.name.last}
								</span>
							</a>
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm">
							{sectionsMap.get(user.personal_data.section)}
						</p>
					</td>
					<td class="w-1/4">
						<p class="text-xs md:text-sm">
							{user.score}
							{user.rank.title}
						</p>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
