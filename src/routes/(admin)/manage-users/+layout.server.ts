import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import type { Section } from '$lib/types';
import { CACHE_DURATION } from '$lib/constants';
import type { LayoutServerLoad } from './$types';
import { getStudentCountInSection } from '$lib/utils/functions';

export const load: LayoutServerLoad = async ({ setHeaders }) => {
	const sectionsCollection = collection(db, 'sections');
	const getSections = await getDocs(sectionsCollection);

	let sections: Section[] = [];

	if (!getSections.empty) {
		sections = await Promise.all(
			getSections.docs.map(async (section) => {
				const sectionData = section.data() as Section;
				const studentCount = await getStudentCountInSection(sectionData);
				const newSectionData: Section = {
					count: studentCount,
					...sectionData
				};

				return newSectionData;
			})
		);
	}

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		sections
	};
};
