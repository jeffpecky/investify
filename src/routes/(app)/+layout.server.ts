import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// CRITICAL SECURITY: Enforce complete role separation
	const isAdminRoute = url.pathname.startsWith('/admin');
	const isSettingsRoute = url.pathname.startsWith('/settings');
	
	if (isAdminRoute) {
		// Admin routes require admin role
		if (locals.user.role !== 'admin') {
			throw redirect(303, '/login');
		}
	} else if (!isSettingsRoute) {
		// Customer routes (excluding settings) require customer role (admin CANNOT access customer routes)
		if (locals.user.role === 'admin') {
			throw redirect(303, '/admin/dashboard');
		}
	}
	// Settings routes are accessible by all authenticated users (admin and customer)

	return {
		user: locals.user
	};
};
