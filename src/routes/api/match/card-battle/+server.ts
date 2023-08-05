import { db } from '$lib/firebase/firebase';
import type { CardBattle, Match } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const { matchSetId } = await request.json();

	if (!matchSetId) {
		throw new Error('No selected section in POST request.');
	}

	const cardBattleMatch = await getMatch(matchSetId);

	console.log(cardBattleMatch);

	return json(cardBattleMatch);
};

async function getMatch(matchSetId: string): Promise<CardBattle[]> {
	try {
		const cardBattleCollection = collection(db, `match_sets/${matchSetId}/card_battle`);
		const cardBattleDocs = await getDocs(cardBattleCollection);

		const matches: CardBattle[] = cardBattleDocs.docs.map((match) => match.data() as CardBattle);

		return matches;
	} catch (error) {
		// Handle any potential errors during data fetching
		throw new Error('Failed to fetch card battle matches: ' + error);
	}
}
