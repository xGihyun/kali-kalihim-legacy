import { CACHE_DURATION } from '$lib/constants';
import { db } from '$lib/firebase/firebase';
import type { Section } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';

export const GET: RequestHandler = async ({ setHeaders }) => {
	const sectionsCollection = collection(db, 'sections');
	const getSections = await getDocs(sectionsCollection);

	if (getSections.empty) {
		console.error('No sections yet');
	}

	const sections = getSections.docs.map((section) => {
		const sectionData = section.data() as Section;

		return sectionData;
	});

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return new Response(JSON.stringify(sections));
};
