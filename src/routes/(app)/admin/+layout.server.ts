import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	
	if (!user) {
		throw redirect(303, '/login?returnUrl=/admin');
	}
	
	// CRITICAL: Enforce admin role
	// Redirect non-admin users to login so they can authenticate with admin credentials
	if (user.role !== 'admin') {
		throw redirect(303, '/login?returnUrl=/admin');
	}
	
	return {
		user,
		breadcrumbs: []
	};
};
