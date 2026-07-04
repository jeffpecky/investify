import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { surveys } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const surveysList = await db.select().from(surveys).orderBy(desc(surveys.createdAt)).limit(50);

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Surveys', href: '/admin/surveys' }
		],
		surveys: surveysList
	};
};
