import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { payoutOptions } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const optionsList = await db.select().from(payoutOptions).orderBy(desc(payoutOptions.createdAt));

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Settings', href: '/admin/settings/plan/payout-options' },
			{ title: 'Payout Options', href: '/admin/settings/plan/payout-options' }
		],
		options: optionsList
	};
};
