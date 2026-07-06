import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { plans } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { safeQuery } from '$lib/server/db/utils';

export const load: PageServerLoad = async ({ params, url }) => {
	const { id } = params;

	const [plan] = await safeQuery(
		() => db.select().from(plans).where(eq(plans.id, id)).limit(1),
		'Failed to load plan'
	);

	if (!plan) {
		return {
			plan: null,
			message: 'Plan not found'
		};
	}

	const amount = Number(url.searchParams.get('amount')) || 0;
	const payoutOption = url.searchParams.get('payout') || 'Daily';
	const crypto = url.searchParams.get('crypto') || null;

	// Calculate profit using per-period rate × duration
	const rate = (Number(plan.percentMin) + Number(plan.percentMax)) / 2;
	const totalProfit = amount > 0 ? (amount * rate * plan.durationDays / 100) : 0;

	return {
		breadcrumbs: [
			{ title: 'Home', href: '/' },
			{ title: 'Plans', href: '/plans' },
			{ title: 'Calculator', href: `/calculator/${id}` }
		],
		plan: {
			id: plan.id,
			name: plan.name,
			duration: plan.durationDays,
			minAmount: Number(plan.minAmount),
			maxAmount: Number(plan.maxAmount),
			category: plan.category,
			roi: `${plan.percentMin} - ${plan.percentMax}%`,
			payout: (plan.payoutOptions as string[]) || ['Daily'],
			recommended: plan.recommended
		},
		calculatedInvestment: {
			id: plan.id,
			plan: { name: plan.name, category: plan.category },
			amount,
			payoutOption,
			crypto,
			investedCapital: amount,
			profit: totalProfit,
			totalExpectedProfit: totalProfit
		},
		payouts: []
	};
};
