import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const settings = await db.select().from(siteSettings);

	const settingsMap = settings.reduce((acc, setting) => {
		acc[setting.key] = setting.value;
		return acc;
	}, {} as Record<string, string | null>);

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Settings', href: '/admin/settings/platform' },
			{ title: 'Platform', href: '/admin/settings/platform' }
		],
		settings: settingsMap
	};
};
