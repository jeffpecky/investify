import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { plans } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { safeQuery } from '$lib/server/db/utils';

export const load: PageServerLoad = async () => {
	const plansList = await safeQuery(
		() => db.select().from(plans).where(eq(plans.status, 'active')).orderBy(desc(plans.createdAt)),
		'Failed to load plans'
	);

	return {
		plans: plansList || []
	};
};
