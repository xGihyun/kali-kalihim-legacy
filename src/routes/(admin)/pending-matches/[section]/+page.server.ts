import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import type { Actions } from '@sveltejs/kit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// NOTE: May or may not be used later
export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const data = await request.formData();

			let scores: number[] = [];
			let difference: number;

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
					} else {
						finalScore = currentScore + (score + difference);
					}

					await updateDoc(userRef, { score: finalScore });
				}
			}
		} catch (error) {
			console.error('Form submission error: ', error);
		}
	}
};
