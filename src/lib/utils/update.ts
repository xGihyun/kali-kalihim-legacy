import { db } from '$lib/firebase/firebase';
import type { UserData } from '$lib/types';
import {
	DocumentReference,
	updateDoc,
	type DocumentData,
	getDoc,
	collection,
	query,
	orderBy,
	getDocs,
	doc,
	writeBatch,
	where
} from 'firebase/firestore';

export async function updateRankTitle(userRef: DocumentReference<DocumentData>) {
	const updatedUserDoc = await getDoc(userRef);
	const updatedUserData = updatedUserDoc.data() as UserData;
	const updatedScore = updatedUserData.score;
	let updatedRankTitle = '';

	if (updatedScore >= 100 && updatedScore < 200) {
		updatedRankTitle = 'likas';
	} else if (updatedScore >= 200 && updatedScore < 250) {
		updatedRankTitle = 'likha';
	} else if (updatedScore >= 250 && updatedScore < 300) {
		updatedRankTitle = 'lakan';
	} else if (updatedScore >= 300) {
		updatedRankTitle = 'grandmaster';
	} else {
		updatedRankTitle = '';
	}

	await updateDoc(userRef, { 'rank.title': updatedRankTitle });

	console.log('Rank title updated.');
}

export async function updateOverallRankings() {
	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, orderBy('score', 'desc'));
	const usersDocs = await getDocs(q);
	const batch = writeBatch(db);

	usersDocs.docs.forEach((user, index) => {
		const userRef = doc(db, 'users', user.id);

		batch.update(userRef, { 'rank.number.overall': index + 1 });
	});

	await batch.commit();

	console.log('Overall rankings updated.');
}

export async function updateSectionRankings(section: string) {
	const usersCollection = collection(db, 'users');
	const q = query(usersCollection, where('personal_data.section', '==', section));
	const usersDocs = await getDocs(q);
	const batch = writeBatch(db);

	usersDocs.docs
		.sort((a, b) => (b.data() as UserData).score - (a.data() as UserData).score)
		.forEach((user, index) => {
			const userRef = doc(db, 'users', user.id);
			batch.update(userRef, { 'rank.number.section': index + 1 });
		});

	await batch.commit();

	console.log('Section rankings updated.');
}
