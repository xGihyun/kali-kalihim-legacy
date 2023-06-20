<script lang="ts">
	export let data;

	const section = data.section;
	const matches = data.matches;
</script>

<div class="h-full w-full flex flex-col justify-center items-center px-[5%]">
	<span class="text-center text-lg">{section}</span>
	<div class="table-container max-w-5xl">
		<table class="table table-compact table-hover">
			<thead>
				<tr>
					<th>Player 1</th>
					<th>VS</th>
					<th>Player 2</th>
					<th>Skill to Perform</th>
					<!-- <th>Rating</th> -->
				</tr>
			</thead>
			{#each matches as match, idx (idx)}
				<tbody>
					<tr>
						<td>
							<span>
								{match.players[0].personal_data.name.first}
								{match.players[0].personal_data.name.last}
							</span>
						</td>
						<td>
							<span class="text-primary-500-400-token uppercase">vs</span>
						</td>
						<td>
							<span>
								{match.players[1].personal_data.name.first}
								{match.players[1].personal_data.name.last}
							</span>
						</td>
						<td>{match.skill}</td>
						<!-- <td>{user.score}</td> -->
					</tr>
				</tbody>

				<!-- <div class="flex flex-col gap-4">
							<form class="contents" on:submit|preventDefault={(e) => handleSubmit(e, users)}>
								<div>
									{#each users as user, idx (idx)}
										<label class="label">
											<span
												>Score for {user.personal_data.name.first}
												{user.personal_data.name.last}</span
											>
											<input
												class="input"
												type="text"
												name={`score-${user.auth_data.uid}`}
												required
											/>
										</label>
									{/each}
								</div>
								<button class="mx-auto variant-filled-secondary rounded-md p-2">Submit</button>
							</form>
						</div> -->
			{/each}
		</table>
	</div>
</div>
