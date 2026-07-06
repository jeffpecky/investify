import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { users, investments, wallets, withdrawals, kycDocuments, plans } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import { updateUserSchema } from '$lib/server/validation/admin';
import { logAuditEvent, AuditActions } from '$lib/server/audit';
import { createUserSnapshot } from '$lib/server/services/snapshot-service';

export const load: PageServerLoad = async ({ params }) => {
	const userId = params.id;

	// Get user
	const [user] = await db.select().from(users).where(eq(users.id, userId));

	if (!user) {
		throw error(404, 'User not found');
	}

	// Get user investments
	const userInvestments = await db
		.select({
			id: investments.id,
			amount: investments.amount,
			status: investments.status,
			payoutOption: investments.payoutOption,
			profitAccrued: investments.profitAccrued,
			totalExpectedProfit: investments.totalExpectedProfit,
			startDate: investments.startDate,
			endDate: investments.endDate,
			createdAt: investments.createdAt,
			plan: {
				id: plans.id,
				name: plans.name,
				category: plans.category
			}
		})
		.from(investments)
		.leftJoin(plans, eq(investments.planId, plans.id))
		.where(eq(investments.userId, userId))
		.orderBy(desc(investments.createdAt));

	// Get user wallets
	const userWallets = await db
		.select()
		.from(wallets)
		.where(eq(wallets.userId, userId))
		.orderBy(desc(wallets.createdAt));

	// Get user withdrawals
	const userWithdrawals = await db
		.select()
		.from(withdrawals)
		.where(eq(withdrawals.userId, userId))
		.orderBy(desc(withdrawals.createdAt))
		.limit(10);

	// Get KYC documents
	const userKycDocuments = await db
		.select()
		.from(kycDocuments)
		.where(eq(kycDocuments.userId, userId))
		.orderBy(desc(kycDocuments.createdAt));

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Users', href: '/admin/users' },
			{ title: user.email, href: `/admin/users/${userId}` }
		],
		viewedUser: user,
		investments: userInvestments,
		wallets: userWallets,
		withdrawals: userWithdrawals,
		kycDocuments: userKycDocuments
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, params }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		
		const result = updateUserSchema.safeParse(data);
		
		if (!result.success) {
			return fail(400, {
				errors: result.error.flatten().fieldErrors,
				data
			});
		}
		
		try {
			await db
				.update(users)
				.set({
					...result.data,
					updatedAt: new Date()
				})
				.where(eq(users.id, params.id));
			
			return {
				success: true,
				message: 'User updated successfully'
			};
		} catch (error) {
			return fail(500, {
				error: 'Failed to update user',
				data
			});
		}
	},
	
	updateBalances: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const walletBalance = formData.get('walletBalance');
		const tokenBalance = formData.get('tokenBalance');
		
		try {
			const [before] = await db
				.select({ walletBalance: users.walletBalance, tokenBalance: users.tokenBalance })
				.from(users)
				.where(eq(users.id, params.id))
				.limit(1);

			await db
				.update(users)
				.set({
					walletBalance: walletBalance?.toString() || '0',
					tokenBalance: tokenBalance?.toString() || '0',
					updatedAt: new Date()
				})
				.where(eq(users.id, params.id));

			await logAuditEvent({
				userId: locals.user?.id || '',
				action: AuditActions.ADMIN_UPDATE_BALANCE,
				resourceType: 'user',
				resourceId: params.id,
				details: {
					oldWalletBalance: before?.walletBalance,
					newWalletBalance: walletBalance?.toString() || '0',
					oldTokenBalance: before?.tokenBalance,
					newTokenBalance: tokenBalance?.toString() || '0'
				},
				ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown'
			});

			await createUserSnapshot(params.id);
			
			return {
				success: true,
				message: 'Balances updated successfully'
			};
		} catch (error) {
			return fail(500, {
				error: 'Failed to update balances'
			});
		}
	}
};
