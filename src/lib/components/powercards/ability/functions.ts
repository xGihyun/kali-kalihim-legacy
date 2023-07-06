import { powerCardsMap } from '$lib/data';
import { db } from '$lib/firebase/firebase';
import type { MatchSet, Match, UserData, UserPowerCard } from '$lib/types';
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

export async function warlordsDomain(userUID: string, skill: string) {
	const batch = writeBatch(db);
	const userRef = doc(db, 'users', userUID);
	const userDoc = await getDoc(userRef);
	const user = userDoc.data() as UserData;
	const userPowerCards = user.power_cards;
	const userPowerCardIndex = user.power_cards.findIndex((card) => card.key === "warlord's-domain");

	userPowerCards[userPowerCardIndex].activated = true;

	batch.update(userRef, { power_cards: userPowerCards });

	// Will be updated if the list of pending matches is no longer needed
	const userPendingMatchesCollection = collection(db, `users/${userUID}/pending_matches`);
	const userPendingMatchesQuery = query(userPendingMatchesCollection, orderBy('timestamp', 'desc'));
	const getUserPendingMatchesDocs = await getDocs(userPendingMatchesQuery);
	const latestUserPendingMatchDoc = getUserPendingMatchesDocs.docs[0];

	if (!latestUserPendingMatchDoc) {
		console.error('No pending match!');
		return;
	}

	const latestUserPendingMatchData = latestUserPendingMatchDoc.data() as Match;
	const pendingMatchRef = doc(
		db,
		`users/${userUID}/pending_matches/${latestUserPendingMatchDoc.id}`
	);

	batch.update(pendingMatchRef, { skill });

	const latestMatchPlayers = latestUserPendingMatchData.players;
	const latestMatchSet = await getLatestMatchSet(user.personal_data.section);

	if (!latestMatchSet) {
		console.error('No latest match set');
		return;
	}

	const matchesCollection = collection(db, `match_sets/${latestMatchSet?.id}/matches`);
	const matchQuery = query(
		matchesCollection,
		where('uids', 'array-contains', user.auth_data.uid),
		where('status', '==', 'pending')
	);
	const getMatchDocs = await getDocs(matchQuery);
	const matchDoc = getMatchDocs.docs[0];
	const matchRef = doc(db, `match_sets/${latestMatchSet.id}/matches/${matchDoc?.id}`);

	const findOpponent = latestMatchPlayers.find((opponent) => opponent.auth_data.uid !== userUID);

	if (!findOpponent) return;

	const opponentRef = doc(db, 'users', findOpponent.auth_data.uid);
	const getOpponentDoc = await getDoc(opponentRef);
	const opponentData = getOpponentDoc.data() as UserData;

	const isCancelled = opponentData.power_cards.find(
		(card) => card.key === "warlord's-domain" && card.activated
	);

	const originalSkill = latestUserPendingMatchData.skill;

	if (isCancelled) {
		batch.update(matchRef, { skill: originalSkill });
		await batch.commit();
		return;
	}

	batch.update(matchRef, { skill });

	await batch.commit();
}

export async function doubleEdgedSword(userUID: string) {
	const userRef = doc(db, 'users', userUID);
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

export async function viralxRival(userUiD: string, opponentUID: string) {
	const userRef = doc(db, 'users', userUiD);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex((card) => card.key === 'viral-x-rival');

	userPowerCards[userPowerCardIndex].activated = true;

	const opponentRef = doc(db, 'users', opponentUID);
	const opponentDoc = await getDoc(opponentRef);
	const opponentData = opponentDoc.data() as UserData;
	const isCancelled = opponentData.power_cards.find(
		(card) => card.key === 'twist-of-fate' && card.activated && !card.used
	);

	if (isCancelled) {
		// Restore the default match state
		const latestMatchSet = await getLatestMatchSet(userData.personal_data.section);

		if (!latestMatchSet) return;

		const latestMatchCollection = collection(db, `match_sets/${latestMatchSet.id}/matches`);
		const defaultMatchCollection = collection(
			db,
			`match_sets/${latestMatchSet.id}/default_matches`
		);

		const getDefaultMatchDocs = await getDocs(defaultMatchCollection);

		getDefaultMatchDocs.forEach(async (match) => {
			const latestMatchRef = doc(latestMatchCollection, match.id);
			const defaultMatchData = match.data() as Match;

			await updateDoc(latestMatchRef, { ...defaultMatchData });
		});

		console.log('opponent has used twist of fate');
	}

	await updateDoc(userRef, { power_cards: userPowerCards });
}

export async function twistOfFate(
	user: UserData,
	currentOpponent: UserData,
	newOpponent: UserData
) {
	const batch = writeBatch(db);
	const userRef = doc(db, 'users', user.auth_data.uid);
	const userDoc = await getDoc(userRef);
	const userData = userDoc.data() as UserData;
	const userPowerCards = userData.power_cards;
	const userPowerCardIndex = userData.power_cards.findIndex((card) => card.key === 'twist-of-fate');

	userPowerCards[userPowerCardIndex].activated = true;

	const opponentRef = doc(db, 'users', currentOpponent.auth_data.uid);
	const opponentDoc = await getDoc(opponentRef);
	const opponentData = opponentDoc.data() as UserData;
	const isCancelled = opponentData.power_cards.find(
		(card) => card.key === 'viral-x-rival' && card.activated && !card.used
	);

	if (isCancelled) {
		await updateDoc(userRef, { power_cards: userPowerCards });
		console.log('opponent has used viral rival');
		return;
	}

	// MATCH SETS
	const latestMatchSet = await getLatestMatchSet(user.personal_data.section);

	if (!latestMatchSet) {
		console.error('No latest match');
		return;
	}

	const latestMatchCollection = collection(db, `match_sets/${latestMatchSet.id}/matches`);

	const currentOpponentMatchQuery = query(
		latestMatchCollection,
		where('uids', 'array-contains', currentOpponent.auth_data.uid),
		where('status', '==', 'pending')
	);

	const newOpponentMatchQuery = query(
		latestMatchCollection,
		where('uids', 'array-contains', newOpponent.auth_data.uid),
		where('status', '==', 'pending')
	);

	// Get the user's current opponent
	const getCurrentOpponentMatch = await getDocs(currentOpponentMatchQuery);
	const currentOpponentMatchDoc = getCurrentOpponentMatch.docs[0];
	const currentOpponentMatchData = currentOpponentMatchDoc?.data() as Match;
	const currentOpponentMatchRef = doc(
		db,
		`match_sets/${latestMatchSet.id}/matches/${currentOpponentMatchDoc.id}`
	);
	const currentOpponentMatchPlayers = currentOpponentMatchData.players;

	// Current user
	const currentOpponentMatchOriginalOpponentIndex = currentOpponentMatchPlayers.findIndex(
		(player) => player.auth_data.uid !== currentOpponent.auth_data.uid
	);

	// Get original opponent of the selected opponent
	const getNewOpponentMatchSetMatch = await getDocs(newOpponentMatchQuery);
	const newOpponentMatchDoc = getNewOpponentMatchSetMatch.docs[0];
	const newOpponentMatchData = newOpponentMatchDoc?.data() as Match;
	const newOpponentMatchRef = doc(
		db,
		`match_sets/${latestMatchSet.id}/matches/${newOpponentMatchDoc.id}`
	);
	const newOpponentMatchPlayers = newOpponentMatchData.players;

	// Opponent of selected opponent
	const newOpponentMatchOriginalOpponentIndex = newOpponentMatchPlayers.findIndex(
		(player) => player.auth_data.uid !== newOpponent.auth_data.uid
	);

	console.log('before:');
	console.log(currentOpponentMatchPlayers);
	console.log(newOpponentMatchPlayers);

	// Create new arrays to hold the updated player data
	const updatedCurrentOpponentMatchPlayers = [...currentOpponentMatchPlayers];
	const updatedNewOpponentMatchPlayers = [...newOpponentMatchPlayers];

	// Update the player data in the new arrays
	updatedCurrentOpponentMatchPlayers[currentOpponentMatchOriginalOpponentIndex] =
		newOpponentMatchPlayers[newOpponentMatchOriginalOpponentIndex];
	updatedNewOpponentMatchPlayers[newOpponentMatchOriginalOpponentIndex] =
		currentOpponentMatchPlayers[currentOpponentMatchOriginalOpponentIndex];

	console.log('after:');
	console.log(updatedCurrentOpponentMatchPlayers);
	console.log(updatedNewOpponentMatchPlayers);

	// Update the matches with the new player data
	batch.update(currentOpponentMatchRef, {
		players: updatedCurrentOpponentMatchPlayers,
		uids: [
			updatedCurrentOpponentMatchPlayers[0].auth_data.uid,
			updatedCurrentOpponentMatchPlayers[1].auth_data.uid
		]
	});

	batch.update(newOpponentMatchRef, {
		players: updatedNewOpponentMatchPlayers,
		uids: [
			updatedNewOpponentMatchPlayers[0].auth_data.uid,
			updatedNewOpponentMatchPlayers[1].auth_data.uid
		]
	});

	// Commit the batch write
	await batch.commit();
}

async function getLatestMatchSet(section: string) {
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

	return latestMatchSet;
}

// THIS IS PREVIOUS CODE FOR TWIST OF FATE, PUT HERE FOR NOW
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
