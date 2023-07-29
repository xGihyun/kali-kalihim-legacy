import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// if (!locals.userData || !locals.userData.auth_data || !locals.userData.auth_data.uid) {
	// 	return;
	// }

	return {
		user: locals.userData,
	};
};
