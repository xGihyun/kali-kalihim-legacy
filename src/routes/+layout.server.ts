import { collection, getDocs } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase/firebase';
import type { Section } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.userData || !locals.userData.auth_data || !locals.userData.auth_data.uid) {
		return;
	}

	const sectionsCollection = collection(db, 'sections');
	const getSections = await getDocs(sectionsCollection);
	const sections = getSections.docs.map((section) => {
		const sectionData = section.data() as Section;
		const value = sectionData.name;
		const key = section.id;

		return {
			key,
			value
		};
	});

	const sectionMap: Map<string, string> = new Map();

	sections.forEach((section) => {
		sectionMap.set(section.key, section.value);
	});

	return {
		user: locals.userData,
		sectionMap
	};
};
