import { auth, db } from '$lib/firebase/firebase';
import { redirect, type Actions } from '@sveltejs/kit';
import {
	collection,
	doc,
	getCountFromServer,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore';
import { currentUser } from '$lib/store';
import { defaultUserData } from '$lib/default';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	fetchSignInMethodsForEmail
} from 'firebase/auth';
import type {
	Match,
	ArnisMatchHistory,
	UserData,
	UserPersonalData,
	UserPowerCard,
	UserRankingData,
	CardBattle
} from '$lib/types';
import type { PageServerLoad } from './$types';
import { CACHE_DURATION } from '$lib/constants';
import { powerCardsMap } from '$lib/data';
import { dataToObject } from '$lib/utils/functions';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	if (!locals.userData) {
		return;
	}

	const userUID = locals.userData.auth_data.uid;

	const fetchPendingMatches = async () => {
		const pendingMatchesCollection = collection(db, `users/${userUID}/pending_matches`);
		const pendingMatchesQuery = query(
			pendingMatchesCollection,
			orderBy('timestamp', 'desc'),
			limit(1)
		);
		const pendingMatchesSnapshot = await getDocs(pendingMatchesQuery);

		if (!pendingMatchesSnapshot.empty) {
			const latestPendingMatch = dataToObject(pendingMatchesSnapshot.docs[0].data()) as Match;
			const latestOpponent = dataToObject(
				latestPendingMatch.players.find((player) => player.auth_data.uid !== userUID)
			) as UserData;

			return {
				match: latestPendingMatch,
				opponent: latestOpponent
			};
		}
	};

	const fetchArnisMatchHistory = async () => {
		const matchHistoryCollection = collection(db, `users/${userUID}/match_history`);
		const matchHistoryQuery = query(matchHistoryCollection, orderBy('timestamp', 'desc'));
		const matchHistorySnapshot = await getDocs(matchHistoryQuery);

		if (!matchHistorySnapshot.empty) {
			const matchHistory = matchHistorySnapshot.docs.map(
				(match) => dataToObject(match.data()) as ArnisMatchHistory
			);

			return matchHistory;
		}
	};

	const fetchCardBattleHistory = async () => {
		const cardBattleCollection = collection(db, `users/${userUID}/card_battle_history`);
		const getCardBattle = await getDocs(cardBattleCollection);

		if (!getCardBattle.empty) {
			const cardBattleHistory = getCardBattle.docs.map(
				(match) => dataToObject(match.data()) as CardBattle
			);

			return cardBattleHistory;
		}
	};

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		latestPendingMatch: fetchPendingMatches(),
		matchHistory: fetchArnisMatchHistory(),
		cardBattleHistory: fetchCardBattleHistory()
	};
};

// TODO: Use Zod
export const actions: Actions = {
	register: async ({ request, locals }) => {
		const userUid = locals.userData.auth_data.uid;

		if (!userUid) {
			return;
		}

		const userRef = doc(db, 'users', userUid);

		const data = await request.formData();
		const firstName = data.get('first-name')?.toString().trim();
		const lastName = data.get('last-name')?.toString().trim();
		const age = Number(data.get('age'));
		const sex = data.get('sex')?.toString();
		const section = data.get('section')?.toString();
		const contactNumber = Number(data.get('contact-number')?.toString().trim());

		const newPersonalData: UserPersonalData = {
			age: age,
			contact_number: contactNumber,
			name: {
				first: firstName || '',
				last: lastName || ''
			},
			section: section || '',
			sex: sex || ''
		};

		const usersCollection = collection(db, 'users');
		const usersInSectionCollection = query(
			usersCollection,
			where('personal_data.section', '==', section || '')
		);
		const usersSnapshot = await getCountFromServer(usersCollection);
		const usersInSectionSnapshot = await getCountFromServer(usersInSectionCollection);
		const usersSnapshotCount = usersSnapshot.data().count;
		const usersInSectionSnapshotCount = usersInSectionSnapshot.data().count;

		// Add + 1 to usersInSectionSnapshotCount since the user's section is still not set in the db, therefore not counting the user
		const newRankingData: UserRankingData = {
			number: {
				overall: usersSnapshotCount,
				section: usersInSectionSnapshotCount + 1
			},
			title: ''
		};

		// I think this is bad
		currentUser.update(
			(val) =>
				(val = {
					...val,
					auth_data: {
						...val.auth_data,
						is_registered: true
					},
					personal_data: {
						...val.personal_data,
						...newPersonalData
					},
					rank: {
						...val.rank,
						...newRankingData
					}
				})
		);

		await updateDoc(userRef, {
			'auth_data.is_registered': true,
			personal_data: newPersonalData,
			rank: {
				...newRankingData
			}
		});

		console.log('Now registered!');

		throw redirect(302, '/');
	},
	login: async ({ request, cookies, locals }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString().trim();

		if (!email || !password) {
			console.log('Missing email or password.');
			return;
		}

		console.log('Logging in!');

		const signInMethodsForEmail = await fetchSignInMethodsForEmail(auth, email);
		const isEmailAvailable = signInMethodsForEmail.length !== 0;

		if (!isEmailAvailable) {
			const result = await createUserWithEmailAndPassword(auth, email, password);
			const user = result.user;

			const userRef = doc(db, 'users', user.uid);

			const newUserData: UserData = {
				...defaultUserData,
				auth_data: {
					email: user.email || '',
					is_logged_in: true,
					is_registered: false,
					photo_url: user.photoURL,
					role: 'user',
					uid: user.uid,
					username: user.displayName
				}
			};

			await setDoc(userRef, newUserData);

			const userDoc = await getDoc(userRef);
			const userData = userDoc.data() as UserData;

			locals.userData = userData;

			console.log('\nRegistered.');

			currentUser.update(
				(val) =>
					(val = {
						...val,
						auth_data: {
							...userData.auth_data
						},
						personal_data: {
							...userData.personal_data
						}
					})
			);

			cookies.set('session', user.uid, { maxAge: 60 * 60 * 24 * 7 });
		} else {
			const result = await signInWithEmailAndPassword(auth, email, password);
			const user = result.user;

			const userRef = doc(db, 'users', user.uid);

			await updateDoc(userRef, { 'auth_data.is_logged_in': true });

			// Get the updated user data
			const userDoc = await getDoc(userRef);
			const userData = userDoc.data() as UserData;

			locals.userData = userData;

			console.log('\nLogged in.');

			currentUser.update(
				(val) =>
					(val = {
						...val,
						auth_data: {
							...userData.auth_data
						},
						personal_data: {
							...userData.personal_data
						}
					})
			);

			cookies.set('session', user.uid, { maxAge: 60 * 60 * 24 * 7 });
		}

		throw redirect(302, '/');
	},
	powercards: async ({ request, locals }) => {
		const userUID = locals.userData.auth_data.uid;
		const data = await request.formData();
		const cards = data.get('cards')?.toString();

		if (!cards) return;

		const cardKeys: string[] = JSON.parse(cards);

		if (cardKeys.length < 3) return;

		const powercards: UserPowerCard[] = cardKeys.map((card) => {
			const newCard: UserPowerCard = {
				activated: false,
				key: card,
				name: powerCardsMap.get(card)?.name || '',
				used: false
			};

			return newCard;
		});

		const userRef = doc(db, 'users', userUID);

		await updateDoc(userRef, { power_cards: powercards });
	}
};
