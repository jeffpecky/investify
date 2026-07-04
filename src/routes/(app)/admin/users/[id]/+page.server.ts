import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, investments, wallets, withdrawals, kycDocuments, plans } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

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
		user,
		investments: userInvestments,
		wallets: userWallets,
		withdrawals: userWithdrawals,
		kycDocuments: userKycDocuments
	};
};
