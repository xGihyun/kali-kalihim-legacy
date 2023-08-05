import { CACHE_DURATION } from '$lib/constants';
import { db } from '$lib/firebase/firebase';
import type { Match } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request, setHeaders }) => {
	const { matchSetId } = await request.json();

	if (!matchSetId) {
		throw new Error('No selected section in POST request.');
	}

	const arnisMatch = await getMatch(matchSetId);

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return json(arnisMatch);
};

async function getMatch(matchSetId: string): Promise<Match[]> {
	try {
		const matchSetCollection = collection(db, `match_sets/${matchSetId}/matches`);
		const matchesDocs = await getDocs(matchSetCollection);

		const matches: Match[] = matchesDocs.docs.map((match) => match.data() as Match);

		return matches;
	} catch (error) {
		// Handle any potential errors during data fetching
		throw new Error('Failed to fetch matches: ' + error);
	}
}
