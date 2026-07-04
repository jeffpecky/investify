import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { holidays } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const holidaysList = await db.select().from(holidays).orderBy(desc(holidays.date));

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Settings', href: '/admin/settings/plan/holidays' },
			{ title: 'Holidays', href: '/admin/settings/plan/holidays' }
		],
		holidays: holidaysList
	};
};
