import { CACHE_DURATION } from '$lib/constants';
import { db } from '$lib/firebase/firebase';
import type { Section } from '$lib/types';
import { error, type RequestHandler } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';

export const GET: RequestHandler = async ({ setHeaders }) => {
	const sectionsCollection = collection(db, 'sections');
	const getSections = await getDocs(sectionsCollection);

	if (getSections.empty) {
		throw error(404, 'No sections available.');
	}

	const sections = getSections.docs.map((section) => section.data() as Section);

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return new Response(JSON.stringify(sections));
};
