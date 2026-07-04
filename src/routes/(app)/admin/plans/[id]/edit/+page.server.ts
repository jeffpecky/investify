import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { plans } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const planId = params.id;

	const [plan] = await db.select().from(plans).where(eq(plans.id, planId));

	if (!plan) {
		throw error(404, 'Plan not found');
	}

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Plans', href: '/admin/plans' },
			{ title: 'Edit Plan', href: `/admin/plans/${planId}/edit` }
		],
		plan
	};
};
