import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Redirect /admin to /admin/dashboard
export const load: PageServerLoad = async () => {
	throw redirect(303, '/admin/dashboard');
};
