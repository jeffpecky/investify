import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { deposits, users, platformWallets } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { safeQuery, withTransaction } from '$lib/server/db/utils';
import { logAuditEvent, AuditActions } from '$lib/server/audit';
import { createUserSnapshot } from '$lib/server/services/snapshot-service';

export const load: PageServerLoad = async () => {
	const depositsList = await safeQuery(
		() =>
			db
				.select({
					id: deposits.id,
					amount: deposits.amount,
					cryptocurrency: deposits.cryptocurrency,
					transactionHash: deposits.transactionHash,
					status: deposits.status,
					confirmedAt: deposits.confirmedAt,
					rejectedReason: deposits.rejectedReason,
					createdAt: deposits.createdAt,
					user: {
						id: users.id,
						firstName: users.firstName,
						lastName: users.lastName,
						email: users.email
					},
					wallet: {
						name: platformWallets.name,
						address: platformWallets.address
					}
				})
				.from(deposits)
				.leftJoin(users, eq(deposits.userId, users.id))
				.leftJoin(platformWallets, eq(deposits.platformWalletId, platformWallets.id))
				.orderBy(desc(deposits.createdAt))
				.limit(50),
		'Failed to load deposits'
	);

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Deposits', href: '/admin/deposits' }
		],
		deposits: depositsList
	};
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, { error: 'Deposit ID is required' });
		}

		const [deposit] = await db
			.select()
			.from(deposits)
			.where(eq(deposits.id, id as string))
			.limit(1);

		if (!deposit) {
			return fail(404, { error: 'Deposit not found' });
		}

		if (deposit.status !== 'pending') {
			return fail(400, { error: `Cannot approve deposit with status: ${deposit.status}` });
		}

		try {
			await withTransaction(async (tx) => {
				// Confirm the deposit
				await tx
					.update(deposits)
					.set({
						status: 'confirmed',
						confirmedAt: new Date(),
						confirmedBy: locals.user?.id || null,
						updatedAt: new Date()
					})
					.where(eq(deposits.id, id as string));

				// Credit user's wallet balance
				const [user] = await tx
					.select({ walletBalance: users.walletBalance })
					.from(users)
					.where(eq(users.id, deposit.userId))
					.limit(1);

				if (user) {
					const currentBalance = Number(user.walletBalance);
					const currentDeposited = Number(user.depositedBalance || 0);
					const depositAmount = Number(deposit.amount);

					await tx
						.update(users)
						.set({
							walletBalance: (currentBalance + depositAmount).toString(),
							depositedBalance: (currentDeposited + depositAmount).toString(),
							updatedAt: new Date()
						})
						.where(eq(users.id, deposit.userId));
				}
			});

			await logAuditEvent({
				userId: locals.user?.id || '',
				action: AuditActions.DEPOSIT_APPROVE,
				resourceType: 'deposit',
				resourceId: id as string,
				details: { amount: deposit.amount, cryptocurrency: deposit.cryptocurrency },
				ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown'
			});

			await createUserSnapshot(deposit.userId);

			return { success: true, message: 'Deposit approved and wallet credited' };
		} catch (error) {
			return fail(500, { error: 'Failed to approve deposit' });
		}
	},

	reject: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const reason = formData.get('reason') as string;

		if (!id) {
			return fail(400, { error: 'Deposit ID is required' });
		}

		const [deposit] = await db
			.select()
			.from(deposits)
			.where(eq(deposits.id, id as string))
			.limit(1);

		if (!deposit) {
			return fail(404, { error: 'Deposit not found' });
		}

		if (deposit.status !== 'pending') {
			return fail(400, { error: `Cannot reject deposit with status: ${deposit.status}` });
		}

		try {
			await db
				.update(deposits)
				.set({
					status: 'rejected',
					rejectedReason: reason || 'Rejected by admin',
					updatedAt: new Date()
				})
				.where(eq(deposits.id, id as string));

			await logAuditEvent({
				userId: locals.user?.id || '',
				action: AuditActions.DEPOSIT_REJECT,
				resourceType: 'deposit',
				resourceId: id as string,
				details: { amount: deposit.amount, reason: reason || 'Rejected by admin' },
				ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown'
			});

			return { success: true, message: 'Deposit rejected' };
		} catch (error) {
			return fail(500, { error: 'Failed to reject deposit' });
		}
	}
};
