import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { withdrawals, users, wallets } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { updateWithdrawalSchema } from '$lib/server/validation/admin';

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

export const actions: Actions = {
	approve: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const transactionHash = formData.get('transactionHash');
		
		try {
			await db
				.update(withdrawals)
				.set({
					status: 'completed',
					transactionHash: transactionHash?.toString(),
					processedAt: new Date(),
					updatedAt: new Date()
				})
				.where(eq(withdrawals.id, id as string));
			
			return {
				success: true,
				message: 'Withdrawal approved'
			};
		} catch (error) {
			return fail(500, {
				error: 'Failed to approve withdrawal'
			});
		}
	},
	
	reject: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const notes = formData.get('notes');
		
		try {
			await db
				.update(withdrawals)
				.set({
					status: 'rejected',
					updatedAt: new Date()
				})
				.where(eq(withdrawals.id, id as string));
			
			return {
				success: true,
				message: 'Withdrawal rejected'
			};
		} catch (error) {
			return fail(500, {
				error: 'Failed to reject withdrawal'
			});
		}
	}
};
