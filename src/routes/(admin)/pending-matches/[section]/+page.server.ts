import { collection, getDocs, query, where } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { MatchSet, MatchSets, Section } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const { section } = params;

	const matchSets = await getMatchSets(section);
	const sectionsCollection = collection(db, 'sections');
	const getSections = await getDocs(sectionsCollection);

	const sections = getSections.docs.map((section) => section.data() as Section);

	return {
		matchSets,
		section,
		sections
	};
};

async function getMatchSets(section: string) {
	const matchesCollection = collection(db, 'match_sets');
	const matchQuery = query(matchesCollection, where('section', '==', section));
	const matchSetsDocs = await getDocs(matchQuery);

	// if (matchSetsDocs.empty) {
	// 	return;
	// }

	const matchSets: MatchSets[] = matchSetsDocs.docs
		.map((matchSet) => {
			const matchSetId = matchSet.id;
			const matchSetData = matchSet.data() as MatchSet;

			return {
				id: matchSetId,
				data: matchSetData
			};
		})
		.sort((a, b) => a.data.set - b.data.set);

	return matchSets;
}
