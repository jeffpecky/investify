import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { investments, users, plans, payouts } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const investmentId = params.id;

	// Get investment with user and plan
	const [investment] = await db
		.select({
			id: investments.id,
			amount: investments.amount,
			status: investments.status,
			paymentMethod: investments.paymentMethod,
			cryptoSymbol: investments.cryptoSymbol,
			cryptoAmount: investments.cryptoAmount,
			transactionHash: investments.transactionHash,
			payoutOption: investments.payoutOption,
			profitAccrued: investments.profitAccrued,
			totalExpectedProfit: investments.totalExpectedProfit,
			startDate: investments.startDate,
			endDate: investments.endDate,
			nextPayoutDate: investments.nextPayoutDate,
			createdAt: investments.createdAt,
			updatedAt: investments.updatedAt,
			user: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email
			},
			plan: {
				id: plans.id,
				name: plans.name,
				category: plans.category,
				minAmount: plans.minAmount,
				maxAmount: plans.maxAmount,
				durationDays: plans.durationDays,
				percentMin: plans.percentMin,
				percentMax: plans.percentMax
			}
		})
		.from(investments)
		.leftJoin(users, eq(investments.userId, users.id))
		.leftJoin(plans, eq(investments.planId, plans.id))
		.where(eq(investments.id, investmentId));

	if (!investment) {
		throw error(404, 'Investment not found');
	}

	// Get payouts for this investment
	const investmentPayouts = await db
		.select()
		.from(payouts)
		.where(eq(payouts.investmentId, investmentId))
		.orderBy(desc(payouts.date));

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Investments', href: '/admin/investments' },
			{ title: `Investment #${investmentId.slice(0, 8)}`, href: `/admin/investments/${investmentId}` }
		],
		investment,
		payouts: investmentPayouts
	};
};
