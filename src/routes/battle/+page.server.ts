import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

export const load: PageServerLoad = async () => {};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData();
		const battleCards = data.get('battlecards')?.toString();

		if (!battleCards) return;

		const cards = JSON.parse(battleCards) as string[];

		console.log(cards);

		const userUID = locals.userData.auth_data.uid;
		const batch = writeBatch(db);

		for (let i = 0; i < cards.length; i++) {
			const battleCardsRef = doc(db, `users/${userUID}/battle_cards/${i}`);
			batch.set(battleCardsRef, { name: cards[i] });
		}

		await batch.commit();
	}
};
