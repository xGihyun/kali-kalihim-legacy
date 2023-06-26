import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateOverallRankings, updateRankTitle, updateSectionRankings } from '$lib/utils/update';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.formData();

		let scores: number[] = [];
		let difference: number;

		// Variable not used yet
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
			if (name.startsWith('initial-score-')) {
				const uid = name.substring('initial-score-'.length);
				const initialScore = Number(value);

				if (isNaN(initialScore)) {
					console.error('Input initial score is not a number.');
					throw error(403, 'Not a number');
				}

				console.log(initialScore);

				const userRef = doc(db, 'users', uid);
				// const userDoc = await getDoc(userRef);
				// const userData = userDoc.data() as UserData;

				await setDoc(userRef, { score: initialScore }, { merge: true });

				// await updateRankTitle(userRef);
				// await updateSectionRankings(userData.personal_data.section);
			}

			if (name.startsWith('score-')) {
				const uid = name.substring('score-'.length);
				const score = Number(value);

				if (isNaN(score)) {
					console.error('Score is not a number.');
					throw error(403, 'Not a number');
				}

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

				await updateRankTitle(userRef);
				await updateSectionRankings(userData.personal_data.section);
			}
		}

		await updateOverallRankings();

		console.log('Submitted scores successfully!');

		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Score submission error: ', error);
	}

	return new Response();
};
