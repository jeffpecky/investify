import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { platformWallets } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const walletsList = await db.select().from(platformWallets).orderBy(desc(platformWallets.createdAt));

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Settings', href: '/admin/settings/wallets' },
			{ title: 'Wallets', href: '/admin/settings/wallets' }
		],
		wallets: walletsList
	};
};
