import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// TODO: Fetch analytics data
	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Analytics', href: '/admin/analytics' }
		],
		metrics: {
			revenue: 0,
			activeUsers: 0,
			conversionRate: 0
		}
	};
};
