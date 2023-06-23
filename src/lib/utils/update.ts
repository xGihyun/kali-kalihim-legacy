import type { UserData } from '$lib/types';
import { DocumentReference, updateDoc, type DocumentData, getDoc } from 'firebase/firestore';

export async function updateRank(userRef: DocumentReference<DocumentData>) {
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
	}
	await updateDoc(userRef, { 'rank.title': updatedRankTitle });

	console.log('Rank has been updated.')
}
