import { db } from '../db';
import { investments, payouts, users } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { createUserSnapshot } from './snapshot-service';

/**
 * PAYOUT GENERATOR SERVICE
 * 
 * Creates payout records based on investment schedule
 * Handles different payout frequencies: daily, weekly, monthly, end of term
 * 
 * IMPORTANT: Interest payouts are AUTOMATIC and credit wallet balance immediately
 * This is different from WITHDRAWALS which require admin approval
 */

export interface PayoutResult {
	success: boolean;
	payoutsCreated: number;
	totalAmount: number;
	errors: string[];
}

/**
 * Generate payouts for investments based on their schedule
 */
export async function generatePayouts(): Promise<PayoutResult> {
	const result: PayoutResult = {
		success: true,
		payoutsCreated: 0,
		totalAmount: 0,
		errors: []
	};

	try {
		// Get all active investments
		const activeInvestments = await db
			.select({
				id: investments.id,
				userId: investments.userId,
				amount: investments.amount,
				profitAccrued: investments.profitAccrued,
				payoutOption: investments.payoutOption,
				lastPayoutDate: investments.lastPayoutDate,
				startDate: investments.startDate
			})
			.from(investments)
			.where(eq(investments.status, 'active'));

		console.log(`[Payout Generator] Processing ${activeInvestments.length} investments`);

		for (const investment of activeInvestments) {
			try {
				const shouldPayout = checkPayoutSchedule(
					investment.payoutOption,
					investment.lastPayoutDate,
					investment.startDate
				);

				if (shouldPayout) {
					const payoutAmount = parseFloat(investment.profitAccrued || '0');

					// Only create payout if there's profit to pay
					if (payoutAmount > 0) {
						// AUTOMATICALLY credit user's wallet balance (no admin approval needed)
						await db
							.update(users)
							.set({
								walletBalance: sql`wallet_balance + ${payoutAmount}`
							})
							.where(eq(users.id, investment.userId));

						// Create payout record for history (already completed)
						await createPayoutRecord({
							investmentId: investment.id,
							userId: investment.userId,
							amount: payoutAmount,
							type: 'interest',
							payoutOption: investment.payoutOption,
							autoApproved: true // Mark as auto-approved
						});

						// Reset profit accrued (it's been paid out)
						await db
							.update(investments)
							.set({
								profitAccrued: '0',
								lastPayoutDate: new Date(),
								updatedAt: new Date()
							})
							.where(eq(investments.id, investment.id));

						// Create snapshot to capture the wallet balance increase
						await createUserSnapshot(investment.userId);

						result.payoutsCreated++;
						result.totalAmount += payoutAmount;

						console.log(`[Payout Generator] Auto-credited wallet for investment ${investment.id}: $${payoutAmount.toFixed(2)}`);
					}
				}
			} catch (error) {
				const errorMsg = `Failed to generate payout for investment ${investment.id}: ${error}`;
				console.error(errorMsg);
				result.errors.push(errorMsg);
				result.success = false;
			}
		}

		console.log(`[Payout Generator] Complete: ${result.payoutsCreated} payouts created, $${result.totalAmount.toFixed(2)} total`);

		return result;
	} catch (error) {
		console.error('[Payout Generator] Fatal error:', error);
		result.success = false;
		result.errors.push(`Fatal error: ${error}`);
		return result;
	}
}

/**
 * Check if a payout should be created based on schedule
 */
function checkPayoutSchedule(
	payoutOption: string | null,
	lastPayoutDate: Date | string | null,
	startDate: Date | string | null
): boolean {
	const now = new Date();
	const schedule = payoutOption?.toLowerCase() || 'daily';

	// If no last payout date, use start date
	const lastPayout = lastPayoutDate 
		? new Date(lastPayoutDate)
		: (startDate ? new Date(startDate) : now);

	const daysSinceLastPayout = Math.floor(
		(now.getTime() - lastPayout.getTime()) / (1000 * 60 * 60 * 24)
	);

	switch (schedule) {
		case 'daily':
			return daysSinceLastPayout >= 1;
		case 'weekly':
			return daysSinceLastPayout >= 7;
		case 'monthly':
			return daysSinceLastPayout >= 30;
		case 'end':
		case 'end_of_term':
			return false; // Only pay at maturity (handled by maturity handler)
		default:
			return daysSinceLastPayout >= 1;
	}
}

/**
 * Create a payout record in the database
 */
async function createPayoutRecord(params: {
	investmentId: string;
	userId: string;
	amount: number;
	type: 'interest' | 'capital' | 'bonus';
	payoutOption: string | null;
	autoApproved?: boolean;
}) {
	const { investmentId, userId, amount, type, payoutOption, autoApproved = false } = params;

	// Create payout record
	await db.insert(payouts).values({
		investmentId,
		userId,
		amount: amount.toString(),
		type,
		date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
		status: autoApproved ? 'completed' : 'pending', // Auto-approved payouts are completed immediately
		requestedAt: new Date(),
		approvedAt: autoApproved ? new Date() : null,
		createdAt: new Date()
	});

	console.log(`[Payout Generator] Payout record created: ${type} of $${amount.toFixed(2)} for investment ${investmentId} (${autoApproved ? 'auto-approved' : 'pending'})`);
}

/**
 * Create capital return payout (90% of principal)
 */
export async function createCapitalReturnPayout(
	investmentId: string,
	userId: string,
	originalAmount: number
): Promise<void> {
	// Return 90% of capital (10% is platform fee)
	const returnAmount = originalAmount * 0.9;

	await createPayoutRecord({
		investmentId,
		userId,
		amount: returnAmount,
		type: 'capital',
		payoutOption: null
	});

	console.log(`[Payout Generator] Capital return created: $${returnAmount.toFixed(2)} (90% of $${originalAmount.toFixed(2)})`);
}
