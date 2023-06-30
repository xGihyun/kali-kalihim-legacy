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

		// TODO: Use Zod for input validation
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

				await setDoc(userRef, { score: initialScore }, { merge: true });
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
				const userPowerCards = userData.power_cards;
				const currentScore = userData.score;

				const isProtected = userPowerCards.find(
					(card) => card.key === "ancient's-protection" && card.activated && !card.used
				);
				const isDoubledDown = userPowerCards.find(
					(card) => card.key === 'double-edged-sword' && card.activated && !card.used
				);

				let finalScore: number;

				if (score === Math.min(...scores)) {
					const reducedScore = score - difference * 2;

					if (isProtected) {
						finalScore = currentScore + score;
					} else if (isDoubledDown) {
						finalScore = currentScore + reducedScore;
					} else {
						finalScore = currentScore + reducedScore;
					}

					result.loser = name;
				} else {
					const addedScore = score + difference * 2;

					if (isDoubledDown) {
						finalScore = currentScore + addedScore;
					} else {
						finalScore = currentScore + addedScore;
					}

					result.winner = name;
				}

				userPowerCards.forEach((card) => {
					if (card.activated) {
						card.used = true;
					}
				});

				await updateDoc(userRef, { score: finalScore, power_cards: userPowerCards });
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
