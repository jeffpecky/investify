import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userGroups } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const groupsList = await db.select().from(userGroups).orderBy(desc(userGroups.tokenThreshold));

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Settings', href: '/admin/settings/groups' },
			{ title: 'User Groups', href: '/admin/settings/groups' }
		],
		groups: groupsList
	};
};
