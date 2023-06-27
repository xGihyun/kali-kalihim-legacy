import { db } from '$lib/firebase/firebase';
import type { PendingMatch } from '$lib/types';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';

export async function warlordsDomain(uid: string, skill: string) {
	console.log(skill);

	const pendingMatchesCollection = collection(db, `users/${uid}/pending_matches`);
	const q = query(pendingMatchesCollection, orderBy('timestamp.seconds', 'desc'));
	const getPendingMatchesDocs = await getDocs(q);
	const latestPendingMatch = getPendingMatchesDocs.docs.shift();

	if (!latestPendingMatch) {
		console.error('No pending match!');
		return;
	}

	const pendingMatchDoc = doc(db, `users/${uid}/pending_matches/${latestPendingMatch.id}`);

	await updateDoc(pendingMatchDoc, { skill });

	console.log(`Skill: "${skill}" has been chosen.`);
}

export async function doubleEdgedSword() {
	console.log('double edged sword');
}

export async function extraWind() {
	console.log('extra wind');
}

export async function ancientsProtection() {
	console.log('ancients protection');
}

export async function viralxRival() {
	console.log('viral x rival');
}

export async function twistOfFate() {
	console.log('twist of fate');
}
