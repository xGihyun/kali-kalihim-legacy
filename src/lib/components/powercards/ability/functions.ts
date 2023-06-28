import { powerCardsMap } from '$lib/data';
import { db } from '$lib/firebase/firebase';
import type { PendingMatch, UserData, UserPowerCard } from '$lib/types';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc,
	writeBatch
} from 'firebase/firestore';

export async function warlordsDomain(userUid: string, skill: string) {
	const batch = writeBatch(db);
	const userRef = doc(db, 'users', userUid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex(
		(card) => card.key === "warlord's-domain"
	);

	userPowerCards[userPowerCardIndex].activated = true;

	batch.update(userRef, { power_cards: userPowerCards });

	// Will be updated if the list of pending matches is no longer needed
	const userPendingMatchesCollection = collection(db, `users/${userUid}/pending_matches`);
	const userPendingMatchesQuery = query(
		userPendingMatchesCollection,
		orderBy('timestamp.seconds', 'desc')
	);
	const getUserPendingMatchesDocs = await getDocs(userPendingMatchesQuery);
	const latestUserPendingMatch = getUserPendingMatchesDocs.docs.shift();

	if (!latestUserPendingMatch) {
		console.error('No pending match!');
		return;
	}

	const pendingMatchRef = doc(db, `users/${userUid}/pending_matches/${latestUserPendingMatch.id}`);

	batch.update(pendingMatchRef, { skill });

	await batch.commit();
}

export async function doubleEdgedSword(userUid: string) {
	const userRef = doc(db, 'users', userUid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex(
		(card) => card.key === 'double-edged-sword'
	);

	userPowerCards[userPowerCardIndex].activated = true;

	await updateDoc(userRef, { power_cards: userPowerCards });
}

export async function extraWind(userUid: string, card: string) {
	const userRef = doc(db, 'users', userUid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex((card) => card.key === 'extra-wind');

	userPowerCards[userPowerCardIndex].activated = true;

	const newCard: UserPowerCard = {
		activated: false,
		key: card,
		name: powerCardsMap.get(card)?.name as string,
		used: false
	};

	userPowerCards.push(newCard);

	await updateDoc(userRef, { power_cards: userPowerCards });
}

export async function ancientsProtection(userUid: string) {
	const userRef = doc(db, 'users', userUid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex(
		(card) => card.key === "ancient's-protection"
	);

	userPowerCards[userPowerCardIndex].activated = true;

	await updateDoc(userRef, { power_cards: userPowerCards });
}

export async function viralxRival(userUid: string) {
	const userRef = doc(db, 'users', userUid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex((card) => card.key === 'viral-x-rival');

	userPowerCards[userPowerCardIndex].activated = true;

	// const pendingMatchesCollection = collection(db, `users/${userUid}/pending_matches`);
	// const q = query(pendingMatchesCollection, orderBy('timestamp.seconds', 'desc'));
	// const getPendingMatchesDocs = await getDocs(q);
	// const latestPendingMatch = getPendingMatchesDocs.docs.shift()?.data() as PendingMatch;
	// const currentOpponent = latestPendingMatch.players.find(
	// 	(user) => user.auth_data.uid !== userUid
	// );

	// WIP
	await updateDoc(userRef, { power_cards: userPowerCards });
}

export async function twistOfFate(userUid: string, opponentUid: string) {
	const userRef = doc(db, 'users', userUid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex((card) => card.key === 'twist-of-fate');

	userPowerCards[userPowerCardIndex].activated = true;

	await updateDoc(userRef, { power_cards: userPowerCards });
}
