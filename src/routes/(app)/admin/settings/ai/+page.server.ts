import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { aiSettings } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const settings = await db.select().from(aiSettings);

	const settingsMap = settings.reduce((acc, setting) => {
		acc[setting.key] = setting.value;
		return acc;
	}, {} as Record<string, string | null>);

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Settings', href: '/admin/settings/ai' },
			{ title: 'AI', href: '/admin/settings/ai' }
		],
		settings: settingsMap
	};
};
