import type { Actions } from '@sveltejs/kit';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { BattleCard } from '$lib/types';

export const actions: Actions = {
	battle: async ({ locals, request }) => {
		const data = await request.formData();
		const battleCards = data.get('battle_cards')?.toString();

		if (!battleCards) return;

		console.log('Sending cards...');

		const userUID = locals.userData.auth_data.uid;
		const selectedBattleCards = JSON.parse(battleCards) as BattleCard[];
		const batch = writeBatch(db);

		for (let i = 0; i < selectedBattleCards.length; i++) {
			const battleCardsRef = doc(db, `users/${userUID}/battle_cards/card_${i + 1}`);
			batch.set(battleCardsRef, { ...selectedBattleCards[i] });
		}

		await batch.commit();
	}
};
