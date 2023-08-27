import { db } from '$lib/firebase/firebase';
import type { RequestHandler } from '@sveltejs/kit';
import { doc, updateDoc } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const matchSetId = data.get('match_set_id')?.toString();

	if (!matchSetId) {
		throw new Error('Match set ID is undefined.');
	}

	console.log(matchSetId);

	const matchSetRef = doc(db, 'match_sets', matchSetId);
	await updateDoc(matchSetRef, { timer_expired: true });

	return new Response();
};
