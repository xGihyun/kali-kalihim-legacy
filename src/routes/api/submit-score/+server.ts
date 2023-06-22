import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updated } from '$app/stores';
import { updateRank } from '$lib/utils/update';

// NOTE: May or may not be used later
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.formData();

		let scores: number[] = [];
		let difference: number;
		let result = {
			winner: '',
			loser: ''
		};

		for (const [name, value] of data.entries()) {
			if (name.startsWith('score-')) {
				const score = Number(value);
				scores.push(score);
			}
		}

		difference = Math.abs(scores[0] - scores[1]);

		for (const [name, value] of data.entries()) {
			if (name.startsWith('score-')) {
				const uid = name.substring('score-'.length);
				const score = Number(value);

				const userRef = doc(db, 'users', uid);
				const userDoc = await getDoc(userRef);
				const userData = userDoc.data() as UserData;
				const currentScore = userData.score;

				let finalScore: number;

				if (score === Math.min(...scores)) {
					finalScore = currentScore + (score - difference);
					result.loser = name;
				} else {
					finalScore = currentScore + (score + difference);
					result.winner = name;
				}

				await updateDoc(userRef, { score: finalScore });

				await updateRank(userRef);
			}
		}

		console.log('Submitted scores successfully!');

		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Score submission error: ', error);
	}

	return new Response();
};
