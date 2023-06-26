<script lang="ts">
	import { PowerCard } from '$lib/components';
	import { powerCardsMap, sectionsMap } from '$lib/data';
	import { selectedPowerCard } from '$lib/store.js';
	import type { UserData } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	// import { arnis_bg } from '../assets/images';

	export let data;

	$: pendingMatches = data.pendingMatches || [];

	$: user = getContext<Writable<UserData>>('user');
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#if $user.auth_data.is_logged_in && $user.auth_data.is_registered}
		<div class="flex flex-col items-center justify-center gap-10">
			<div class="flex flex-col items-center justify-center gap-4">
				<span class="text-4xl uppercase">(rank logo)</span>
				<span class="text-3xl uppercase">{$user.rank.title}</span>
				<div class="flex flex-col items-center">
					<span>
						{$user.personal_data.name.first}
						{$user.personal_data.name.last}
					</span>
					<span>
						{sectionsMap.get($user.personal_data.section)}
					</span>
				</div>
				<div class="flex gap-4">
					<div class="flex flex-col">
						<span>Overall Ranking:</span>
						<span class="text-secondary-700-200-token text-2xl">#{$user.rank.number.overall}</span>
					</div>
					<div class="flex flex-col">
						<span>Section Ranking:</span>
						<span class="text-secondary-700-200-token text-2xl">#{$user.rank.number.section}</span>
					</div>
				</div>
			</div>
			<div>
				{#if pendingMatches.length > 0}
					<ul class="max-h-[75vh] space-y-4 overflow-auto">
						<!-- {#each data.pendingMatches as match, idx (idx)} -->
						<li class="flex flex-col items-start">
							{#each pendingMatches[0].players as player, playerIdx (playerIdx)}
								{#if player.auth_data.uid !== $user.auth_data.uid}
									<div class="flex flex-col items-center">
										<span>Upcoming match VS:</span>
										<span class="text-sm font-bold md:text-base"
											>{player.personal_data.name.first} {player.personal_data.name.last}</span
										>
									</div>
								{/if}
							{/each}
						</li>
						<!-- {/each} -->
					</ul>
				{:else}
					<span class="flex w-full justify-center opacity-50">No upcoming match</span>
				{/if}
			</div>
			<div class="flex gap-2">
				{#each powerCardsMap as [key, value], idx (idx)}
					<button class="btn variant-filled-secondary" on:click={() => selectedPowerCard.set(key)}>
						{value}
					</button>
				{/each}
			</div>
			<PowerCard />
		</div>
	{:else if $user.auth_data.is_logged_in && !$user.auth_data.is_registered}
		<div class="variant-filled-surface rounded-md p-4">
			<form method="post" action="?/register">
				<label class="label">
					<span>First Name</span>
					<input class="input" type="text" placeholder="eg. Ayaka" name="first-name" required />
				</label>

				<label class="label">
					<span>Last Name</span>
					<input class="input" type="text" placeholder="eg. Kamisato" name="last-name" required />
				</label>

				<label class="label">
					<span>Age</span>
					<input class="input" type="text" placeholder="eg. 18" name="age" required />
				</label>

				<label class="label">
					<span>Sex</span>
					<select class="input" size="1" value="male" name="sex" required>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</label>

				<label class="label">
					<span>Section</span>
					<select class="input" size="1" value="section-1" name="section" required>
						<option value="section-1">Section 1</option>
						<option value="section-2">Section 2</option>
						<option value="section-3">Section 3</option>
						<option value="section-4">Section 4</option>
						<option value="section-5">Section 5</option>
					</select>
				</label>

				<label class="label">
					<span>Email</span>
					<input
						class="input opacity-50"
						type="email"
						placeholder="Aa"
						name="email"
						value={`${$user.auth_data.email}`}
						readonly
					/>
				</label>

				<label class="label">
					<span>Contact No.</span>
					<input
						class="input"
						type="tel"
						placeholder="eg. 09123456789"
						name="contact-number"
						required
					/>
				</label>

				<button class="variant-filled-primary rounded-md p-2">Register</button>
			</form>
		</div>
	{:else if !$user.auth_data.is_logged_in && !$user.auth_data.is_registered}
		<div class="flex h-full w-full items-center">
			<!-- <img
				src={arnis_bg}
				class="hidden h-full w-full max-w-[50vw] object-cover object-[10%] lg:block"
				draggable="false"
				alt="arnis"
			/> -->
			<div class="flex h-full w-full flex-col items-center justify-center">
				<h1
					class="font-gt-walsheim-pro-medium mb-10 select-none text-center text-5xl uppercase md:text-7xl 2xl:text-9xl"
				>
					Kali Kalihim
				</h1>
				<div class="flex flex-col gap-4">
					<form class="contents" method="post" action="?/login">
						<div>
							<label class="label">
								<span>Email</span>
								<input class="input" type="email" name="email" required />
							</label>

							<label class="label">
								<span>Password</span>
								<input class="input" type="password" name="password" required />
							</label>
						</div>
						<button class="btn variant-filled-primary mx-auto flex">
							<span class="text-xl">Submit</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
