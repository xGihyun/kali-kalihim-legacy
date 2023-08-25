import { CACHE_DURATION } from '$lib/constants';
import { db } from '$lib/firebase/firebase';
import type { CardBattle } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request, setHeaders }) => {
	const { matchSetId } = await request.json();

	if (!matchSetId) {
		throw new Error('No selected section in POST request.');
	}

	const cardBattleMatch = await getMatch(matchSetId);

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return json(cardBattleMatch);
};

async function getMatch(matchSetId: string): Promise<CardBattle[]> {
	const cardBattleCollection = collection(db, `match_sets/${matchSetId}/card_battle`);
	const cardBattleDocs = await getDocs(cardBattleCollection);

	const matches: CardBattle[] = cardBattleDocs.docs.map((match) => match.data() as CardBattle);

	return matches;
}
