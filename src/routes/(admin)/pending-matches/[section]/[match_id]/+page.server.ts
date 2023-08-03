import { db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import type { MatchSet, Match, CardBattle } from '$lib/types';
import { CACHE_DURATION } from '$lib/constants';
import type { Actions } from '@sveltejs/kit';
import { battle } from '$lib/utils/battlecards';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const matchSetId = params.match_id;

	const matchSetRef = doc(db, `match_sets/${matchSetId}`);
	const matchSetDoc = await getDoc(matchSetRef);
	const matchSet = matchSetDoc.data() as MatchSet;

	const matchesCollection = collection(db, `match_sets/${matchSetId}/matches`);
	const matchesDocs = await getDocs(matchesCollection);
	const matches = matchesDocs.docs.map(
		(match) => JSON.parse(JSON.stringify(match.data())) as Match
	);

	const cardBattleCollection = collection(db, `match_sets/${matchSetId}/card_battle`);
	const cardBattleDocs = await getDocs(cardBattleCollection);

	const cardBattle: CardBattle[] | undefined = cardBattleDocs.docs.map(
		(match) => JSON.parse(JSON.stringify(match.data())) as CardBattle
	);

	console.log(cardBattle);
	// setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		matchSetId,
		matches,
		matchSet,
		cardBattle
	};
};

// export const actions: Actions = {
// 	card_battle: async ({ params, request }) => {
// 		const matchSetId = params.match_id;
// 		const data = await request.formData();
// 		const cardBattle = data.get('card_battle')?.toString();

// 		if (!cardBattle) return;

// 		console.log('Card BATTLE');
// 		// console.log(cardBattle);

// 		const parsedCardBattle = JSON.parse(cardBattle) as CardBattle[];
// 		console.log(parsedCardBattle);

// 		for (let i = 0; i < parsedCardBattle.length; i++) {
// 			let player1 = parsedCardBattle[i].players[0];
// 			let player2 = parsedCardBattle[i].players[1];

// 			const result = await battle(player1.auth_data.uid, player2.auth_data.uid);

// 			const player1TotalDamage = result[0].totalDamage;
// 			const player2TotalDamage = result[1].totalDamage;

// 			const cardBattleRef = doc(db, `match_sets/${matchSetId}/card_battle/${i + 1}`);

// 			if (player1TotalDamage > -1) {
// 				player1.total_damage = player1TotalDamage;
// 			}
// 			if (player2TotalDamage > -1) {
// 				player2.total_damage = player2TotalDamage;
// 			}

// 			console.log('Updating doc');
// 			await updateDoc(cardBattleRef, { players: [player1, player2] });
// 		}

// parsedCardBattle.forEach(async (match, idx) => {
// 	let player1 = match.players[0];
// 	let player2 = match.players[1];

// 	const result = await battle(player1.auth_data.uid, player2.auth_data.uid);

// 	const player1TotalDamage = result[0].totalDamage;
// 	const player2TotalDamage = result[1].totalDamage;

// 	const cardBattleRef = doc(db, `match_sets/${matchSetId}/card_battle/${idx + 1}`);

// 	if (player1TotalDamage > -1) {
// 		player1.total_damage = player1TotalDamage;
// 	}
// 	if (player2TotalDamage > -1) {
// 		player2.total_damage = player2TotalDamage;
// 	}

// 	console.log('Updating doc');
// 	await updateDoc(cardBattleRef, { players: [player1, player2] });
// });
// 	}
// };
