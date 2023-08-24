import { CACHE_DURATION } from '$lib/constants';
import { db } from '$lib/firebase/firebase';
import type { Section } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

export const GET: RequestHandler = async ({ setHeaders }) => {
	const sectionsCollection = collection(db, 'sections');
	const getSections = await getDocs(sectionsCollection);

	if (getSections.empty) {
		throw new Error('No sections available.');
	}

	const sections = getSections.docs.map((section) => section.data());

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return new Response(JSON.stringify(sections));
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const newSection = data.get('section')?.toString();

	if (!newSection) {
		throw new Error("Expected an input 'section'");
	}

	const key = newSection.toLowerCase().trim().replace(' ', '_');
	const value = newSection.charAt(0).toUpperCase() + newSection.slice(1);
	const sectionRef = doc(db, 'sections', key);
	const newSectionData: Section = {
		name: value,
		id: key
	};
	await setDoc(sectionRef, { ...newSectionData });

	return new Response();
};
