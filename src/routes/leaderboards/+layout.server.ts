import { collection, getDocs } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import type { Section } from '$lib/types';
import { db } from '$lib/firebase/firebase';
import { CACHE_DURATION } from '$lib/constants';

export const load: LayoutServerLoad = async ({ setHeaders }) => {
	const sectionsCollection = collection(db, 'sections');
	const getSections = await getDocs(sectionsCollection);

	let sections: Section[] = [];

	if (!getSections.empty) {
		sections = getSections.docs.map((section) => section.data() as Section);
	}

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		sections
	};
};
