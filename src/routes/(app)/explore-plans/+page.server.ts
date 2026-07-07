import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { plans, investments } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { safeQuery } from '$lib/server/db/utils';

export const load: PageServerLoad = async () => {
	const plansList = await safeQuery(
		() => db.select().from(plans).where(eq(plans.status, 'active')).orderBy(desc(plans.createdAt)),
		'Failed to load plans'
	);

	return {
		plans: plansList || []
	};
};

export const actions: Actions = {
	createInvestment: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'You must be logged in' });
		}

		const formData = await request.formData();
		const planId = formData.get('planId') as string;
		const amount = formData.get('amount') as string;
		const payoutOption = formData.get('payoutOption') as string;
		const paymentMethod = formData.get('paymentMethod') as string;
		const cryptoSymbol = formData.get('cryptoSymbol') as string;

		if (!planId || !amount || !payoutOption || !paymentMethod) {
			return fail(400, { error: 'Missing required fields' });
		}

		const amountNum = parseFloat(amount);
		if (isNaN(amountNum) || amountNum <= 0) {
			return fail(400, { error: 'Invalid amount' });
		}

		// Verify plan exists and is active
		const [plan] = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
		if (!plan || plan.status !== 'active') {
			return fail(404, { error: 'Plan not found or inactive' });
		}

		// Validate amount is within plan range
		const minAmount = parseFloat(plan.minAmount);
		const maxAmount = parseFloat(plan.maxAmount);
		if (amountNum < minAmount || amountNum > maxAmount) {
			return fail(400, {
				error: `Amount must be between $${minAmount} and $${maxAmount}`
			});
		}

		// Calculate duration and expected profit
		const durationDays = plan.durationDays;
		const percentMin = parseFloat(plan.percentMin);
		const percentMax = parseFloat(plan.percentMax);
		const avgPercent = (percentMin + percentMax) / 2;
		const totalExpectedProfit = (amountNum * avgPercent * durationDays) / (100 * 365);

		const startDate = new Date();
		const endDate = new Date();
		endDate.setDate(endDate.getDate() + durationDays);

		// For wallet balance payments, check sufficient balance
		if (paymentMethod === '2') {
			// TODO: Check user wallet balance and deduct
			// For now, treat all payments as pending crypto verification
		}

		// Create investment with pending status
		const [newInvestment] = await db
			.insert(investments)
			.values({
				userId: user.id,
				planId: plan.id,
				amount: amount.toString(),
				profitAccrued: '0',
				totalExpectedProfit: totalExpectedProfit.toString(),
				status: 'pending',
				payoutOption,
				startDate,
				endDate,
				paymentMethod: paymentMethod === '1' ? 'crypto' : 'wallet',
				cryptoSymbol: cryptoSymbol || null
			})
			.returning();

		if (!newInvestment) {
			return fail(500, { error: 'Failed to create investment' });
		}

		return {
			success: true,
			investmentId: newInvestment.id,
			message: 'Investment created. Please complete payment.'
		};
	},

	submitPaymentProof: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'You must be logged in' });
		}

		const formData = await request.formData();
		const investmentId = formData.get('investmentId') as string;
		const transactionHash = formData.get('transactionHash') as string;

		if (!investmentId || !transactionHash) {
			return fail(400, { error: 'Missing required fields' });
		}

		// Verify investment exists and belongs to user
		const [investment] = await db
			.select()
			.from(investments)
			.where(eq(investments.id, investmentId))
			.limit(1);

		if (!investment || investment.userId !== user.id) {
			return fail(404, { error: 'Investment not found' });
		}

		if (investment.status !== 'pending') {
			return fail(400, { error: 'Can only submit payment proof for pending investments' });
		}

		// Update investment with payment proof
		await db
			.update(investments)
			.set({
				transactionHash,
				updatedAt: new Date()
			})
			.where(eq(investments.id, investmentId));

		return {
			success: true,
			message: 'Payment proof submitted. Awaiting admin verification.'
		};
	}
};
