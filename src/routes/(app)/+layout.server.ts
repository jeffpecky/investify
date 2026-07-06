import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// CRITICAL SECURITY: Enforce complete role separation
	const isAdminRoute = url.pathname.startsWith('/admin');
	
	if (isAdminRoute) {
		// Admin routes require admin role
		if (locals.user.role !== 'admin') {
			throw redirect(303, '/login');
		}
	} else {
		// Customer routes require customer role (admin CANNOT access customer routes)
		if (locals.user.role === 'admin') {
			throw redirect(303, '/admin/dashboard');
		}
	}

	return {
		user: locals.user
	};
};
