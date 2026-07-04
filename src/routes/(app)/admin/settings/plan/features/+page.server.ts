import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { planFeatures } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const featuresList = await db.select().from(planFeatures).orderBy(desc(planFeatures.createdAt));

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Settings', href: '/admin/settings/plan/features' },
			{ title: 'Features', href: '/admin/settings/plan/features' }
		],
		features: featuresList
	};
};
