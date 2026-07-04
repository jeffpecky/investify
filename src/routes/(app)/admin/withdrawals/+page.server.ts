import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { withdrawals, users, wallets } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const withdrawalsList = await db
		.select({
			id: withdrawals.id,
			amount: withdrawals.amount,
			cryptoSymbol: withdrawals.cryptoSymbol,
			cryptoAmount: withdrawals.cryptoAmount,
			status: withdrawals.status,
			walletType: withdrawals.walletType,
			transactionHash: withdrawals.transactionHash,
			createdAt: withdrawals.createdAt,
			processedAt: withdrawals.processedAt,
			user: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email
			},
			wallet: {
				id: wallets.id,
				name: wallets.name,
				address: wallets.address,
				cryptocurrency: wallets.cryptocurrency
			}
		})
		.from(withdrawals)
		.leftJoin(users, eq(withdrawals.userId, users.id))
		.leftJoin(wallets, eq(withdrawals.walletId, wallets.id))
		.orderBy(desc(withdrawals.createdAt))
		.limit(50);

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Withdrawals', href: '/admin/withdrawals' }
		],
		withdrawals: withdrawalsList
	};
};
