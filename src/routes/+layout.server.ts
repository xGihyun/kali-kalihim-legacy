import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, setHeaders }) => {
	if (!locals.userData || !locals.userData.auth_data || !locals.userData.auth_data.uid) {
		return;
	}

	setHeaders({ 'cache-control': 'max-age=120, must-revalidate' });

	return {
		user: locals.userData
	};
};
