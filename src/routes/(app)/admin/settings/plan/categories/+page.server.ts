import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { planCategories } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const categoriesList = await db.select().from(planCategories).orderBy(desc(planCategories.createdAt));

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Settings', href: '/admin/settings/plan/categories' },
			{ title: 'Categories', href: '/admin/settings/plan/categories' }
		],
		categories: categoriesList
	};
};
