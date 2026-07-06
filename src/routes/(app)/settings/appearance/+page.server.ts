import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/dashboard' },
			{ title: 'Settings', href: '/settings' },
			{ title: 'Appearance', href: '/settings/appearance' }
		]
	};
};

export const actions: Actions = {
	updateTheme: async ({ request }) => {
		const formData = await request.formData();
		const theme = formData.get('theme') as string;

		if (!theme || !['light', 'dark', 'system'].includes(theme)) {
			return { success: false, error: 'Invalid theme' };
		}

		return { success: true, message: 'Theme preference saved', theme };
	}
};
