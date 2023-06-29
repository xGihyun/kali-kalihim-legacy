import { powerCardsMap } from '$lib/data';
import { db } from '$lib/firebase/firebase';
import type { MatchSet, PendingMatch, UserData, UserPowerCard } from '$lib/types';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where,
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

export async function twistOfFate(
	user: UserData,
	currentOpponent: UserData,
	newOpponent: UserData
) {
	const batch = writeBatch(db);
	const userRef = doc(db, 'users', user.auth_data.uid || '');
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex((card) => card.key === 'twist-of-fate');

	userPowerCards[userPowerCardIndex].activated = true;

	// // THEIR CORRESPONDING PENDING MATCHES
	// Actually this might not be needed since we don't want the opponent see the ability of the power card
	// // Original opponent
	// const currentOpponentPendingMatchesCollection = collection(
	// 	db,
	// 	`users/${currentOpponent.auth_data.uid}/pending_matches`
	// );
	// const currentOpponentPendingMatchesQuery = query(
	// 	currentOpponentPendingMatchesCollection,
	// 	orderBy('timestamp.seconds', 'desc')
	// );
	// const getCurrentOpponentPendingMatches = await getDocs(currentOpponentPendingMatchesQuery);
	// const currentOpponentLatestPendingMatch = getCurrentOpponentPendingMatches.docs.shift();
	// const currentOpponentLatestPendingMatchData =
	// 	currentOpponentLatestPendingMatch?.data() as PendingMatch;
	// // const currentOpponentLatestPendingMatchRef = doc(
	// // 	db,
	// // 	`users/${currentOpponent.auth_data.uid}/pending_matches/${currentOpponentLatestPendingMatch?.id}`
	// // );
	// const currentOpponentLatestPendingMatchPlayers = currentOpponentLatestPendingMatchData.players;
	// const currentOpponentOriginalOpponentIndex = currentOpponentLatestPendingMatchPlayers.findIndex(
	// 	(user) => user.auth_data.uid !== currentOpponent.auth_data.uid
	// );

	// // Selected opponent
	// const newOpponentPendingMatchesCollection = collection(
	// 	db,
	// 	`users/${newOpponent.auth_data.uid}/pending_matches`
	// );
	// const newOpponentPendingMatchesQuery = query(
	// 	newOpponentPendingMatchesCollection,
	// 	orderBy('timestamp.seconds', 'desc')
	// );
	// const getNewOpponentPendingMatches = await getDocs(newOpponentPendingMatchesQuery);
	// const newOpponentLatestPendingMatch = getNewOpponentPendingMatches.docs.shift();
	// const newOpponentLatestPendingMatchData = newOpponentLatestPendingMatch?.data() as PendingMatch;
	// // const newOpponentLatestPendingMatchRef = doc(
	// // 	db,
	// // 	`users/${newOpponent.auth_data.uid}/pending_matches/${newOpponentLatestPendingMatch?.id}`
	// // );
	// const newOpponentLatestPendingMatchPlayers = newOpponentLatestPendingMatchData.players;
	// const newOpponentOriginalOpponentIndex = newOpponentLatestPendingMatchPlayers.findIndex(
	// 	(user) => user.auth_data.uid !== newOpponent.auth_data.uid
	// );

	// // The user's original opponent will be the selected opponent's original opponent
	// currentOpponentLatestPendingMatchPlayers[currentOpponentOriginalOpponentIndex] =
	// 	newOpponentLatestPendingMatchPlayers[newOpponentOriginalOpponentIndex];

	// // The selected opponent's original opponent will be the user
	// newOpponentLatestPendingMatchPlayers[newOpponentOriginalOpponentIndex] = userData;

	// batch.update(currentOpponentLatestPendingMatchRef, {
	// 	players: currentOpponentLatestPendingMatchPlayers
	// });
	// batch.update(newOpponentLatestPendingMatchRef, { players: newOpponentLatestPendingMatchPlayers });

	// This is an absolute mess
	// I am a very bad programmer ;-;
	// MATCH SETS
	const section = user.personal_data.section;
	const matchSetsCollection = collection(db, 'match_sets');
	const matchSetsQuery = query(matchSetsCollection, where('section', '==', section));
	const matchSetsDocs = await getDocs(matchSetsQuery);
	const latestMatchSet = matchSetsDocs.docs
		.map((matchSet) => {
			const matchSetId = matchSet.id;
			const matchSetData = matchSet.data() as MatchSet;

			return {
				id: matchSetId,
				data: matchSetData
			};
		})
		.sort((a, b) => b.data.set - a.data.set)
		.shift();

	const latestMatchSetMatchesCollection = collection(
		db,
		`match_sets/${latestMatchSet?.id}/matches`
	);
	const currentOpponentMatchSetMatchesQuery = query(
		latestMatchSetMatchesCollection,
		where('uids', 'array-contains', currentOpponent.auth_data.uid)
	);
	const newOpponentMatchSetMatchesQuery = query(
		latestMatchSetMatchesCollection,
		where('uids', 'array-contains', newOpponent.auth_data.uid)
	);

	// console.log('Current opponent: ');
	// console.log(currentOpponent);
	// console.log('Selected opponent: ');
	// console.log(newOpponent);

	const getCurrentOpponentMatchSetMatch = await getDocs(currentOpponentMatchSetMatchesQuery);
	// console.log(getCurrentOpponentMatchSetMatch.docs);
	const currentOpponentMatchSetMatch = getCurrentOpponentMatchSetMatch.docs.shift();
	const currentOpponentMatchSetMatchData = currentOpponentMatchSetMatch?.data() as PendingMatch;
	const currentOpponentMatchSetMatchRef = doc(
		db,
		`match_sets/${latestMatchSet?.id}/matches/${currentOpponentMatchSetMatch?.id}`
	);
	const currentOpponentMatchSetMatchPlayers = currentOpponentMatchSetMatchData.players;
	const currentOpponentMatchSetOriginalOpponentIndex =
		currentOpponentMatchSetMatchPlayers.findIndex(
			(user) => user.auth_data.uid !== currentOpponent.auth_data.uid
		);

	const getNewOpponentMatchSetMatch = await getDocs(newOpponentMatchSetMatchesQuery);
	// console.log(getNewOpponentMatchSetMatch.docs);
	const newOpponentMatchSetMatch = getNewOpponentMatchSetMatch.docs.shift();
	const newOpponentMatchSetMatchData = newOpponentMatchSetMatch?.data() as PendingMatch;
	const newOpponentMatchSetMatchRef = doc(
		db,
		`match_sets/${latestMatchSet?.id}/matches/${newOpponentMatchSetMatch?.id}`
	);

	// console.log('CurrentOpponentmatchsetid: ' + currentOpponentMatchSetMatch?.id);
	// console.log('newOpponentmatchsetid: ' + newOpponentMatchSetMatch?.id);
	const newOpponentMatchSetMatchPlayers = newOpponentMatchSetMatchData.players;
	const newOpponentMatchSetOriginalOpponentIndex = newOpponentMatchSetMatchPlayers.findIndex(
		(user) => user.auth_data.uid !== newOpponent.auth_data.uid
	);

	// The user's original opponent will be the selected opponent's original opponent
	currentOpponentMatchSetMatchPlayers[currentOpponentMatchSetOriginalOpponentIndex] =
		newOpponentMatchSetMatchPlayers[newOpponentMatchSetOriginalOpponentIndex];

	// The selected opponent's original opponent will be the user
	newOpponentMatchSetMatchPlayers[newOpponentMatchSetOriginalOpponentIndex] = userData;

	batch.update(currentOpponentMatchSetMatchRef, {
		players: currentOpponentMatchSetMatchPlayers
	});
	batch.update(newOpponentMatchSetMatchRef, { players: newOpponentMatchSetMatchPlayers });

	// console.log('current:');
	// console.log(currentOpponentMatchSetMatch?.data());
	// console.log('new:');
	// console.log(newOpponentMatchSetMatch?.data());

	batch.update(userRef, { power_cards: userPowerCards });

	await batch.commit();
}
