<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { CircleCheckFilled, ClockPause } from '$lib/assets/icons/index.js';
	import { Arnis, Card } from '$lib/components/match';
	import { db } from '$lib/firebase/firebase';
	import type { CardBattle, Match, MatchSet, UserData } from '$lib/types';
	import { TabGroup, TabAnchor, type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import {
		Timestamp,
		addDoc,
		collection,
		doc,
		getDoc,
		getDocs,
		onSnapshot,
		query,
		where
	} from 'firebase/firestore';
	import { afterUpdate, onMount } from 'svelte';

	export let data;

	$: ({ matchSets, section } = data);

	let clickedRow: number | null = null;

	function toggleRow(idx: number) {
		clickedRow = clickedRow === idx ? null : idx;
	}

	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', data.section));
	const unsubMatchSets = onSnapshot(matchQuery, (snapshot) => {
		matchSets = snapshot.docs
			.map((matchSet) => {
				const matchSetId = matchSet.id;
				const matchSetData = matchSet.data() as MatchSet;

				return {
					id: matchSetId,
					data: matchSetData
				};
			})
			.sort((a, b) => a.data.set - b.data.set);

		console.log('Updated match sets.');
	});

	async function handleSubmit(event: SubmitEvent, users: UserData[], matchSetId: string) {
		const form = event?.target as HTMLFormElement;
		const formData = new FormData(form);

		formData.append('matchSetId', matchSetId);
		formData.append('userUid', users[0].auth_data.uid);

		const response = await fetch('/api/submit-score', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Error in submitting score: ' + response.statusText);
		}

		console.log('Scores submitted successfully!');
		form.reset();
		addToMatchHistory(users);
	}

	function addToMatchHistory(users: UserData[]) {
		const currentDate = new Date();

		const matchHistoryData = {
			players: [...users],
			timestamp: Timestamp.fromDate(currentDate)
		};

		users.forEach(async (user) => {
			const matchHistoryCollection = collection(db, `users/${user.auth_data.uid}/match_history`);

			await addDoc(matchHistoryCollection, matchHistoryData);
		});
	}

	async function getMatch(matchSetId: string): Promise<Match[]> {
		const matchSetRef = doc(db, `match_sets/${matchSetId}`);
		const matchSetDoc = await getDoc(matchSetRef);

		if (!matchSetDoc.exists) {
			throw new Error("Match set doesn't exist");
		}

		const matchesCollection = collection(db, `match_sets/${matchSetId}/matches`);
		const matchesDocs = await getDocs(matchesCollection);

		let matches = matchesDocs.docs.map(
			(match) => JSON.parse(JSON.stringify(match.data())) as Match
		);

		return matches;
	}

	async function getCardBattle(matchSetId: string): Promise<CardBattle[]> {
		const matchSetRef = doc(db, `match_sets/${matchSetId}`);
		const matchSetDoc = await getDoc(matchSetRef);

		if (!matchSetDoc.exists) {
			throw new Error("Match set doesn't exist");
		}

		const cardBattleCollection = collection(db, `match_sets/${matchSetId}/card_battle`);
		const cardBattleDocs = await getDocs(cardBattleCollection);

		let cardBattle: CardBattle[] = cardBattleDocs.docs.map(
			(match) => JSON.parse(JSON.stringify(match.data())) as CardBattle
		);

		return cardBattle;
	}

	let matchesResult: Promise<Match[]> | undefined;
	let matchSetId: string;
	let cardBattleResult: Promise<CardBattle[]> | undefined;

	onMount(() => {
		if (matchSets) {
			matchSetId = matchSets[0].id;
			matchesResult = getMatch(matchSetId);
		}
	});

	afterUpdate(() => {
		if (matchSets) {
			matchSetId = matchSets[0].id;
			matchesResult = getMatch(matchSetId);
			cardBattleResult = getCardBattle(matchSetId);
		}
	});

	type BattleTab = 'arnis' | 'card_battle';

	let currentTab: BattleTab = 'arnis';
</script>

<div class="flex gap-4">
	<button class="btn variant-filled" on:click={() => (currentTab = 'arnis')}>Arnis</button>
	<button class="btn variant-filled" on:click={() => (currentTab = 'card_battle')}>Cards</button>
</div>

<div>{section}</div>
<div class="flex h-full w-full flex-col items-center justify-center py-10">
	{#if matchSets && matchSets.length > 0}
		{#if currentTab === 'arnis'}
			<Arnis {matchesResult} {matchSets} {matchSetId} {section} />
		{:else}
			<Card {cardBattleResult} {matchSets} {matchSetId} />
		{/if}
	{:else}
		<div>No matches available</div>
	{/if}
</div>
