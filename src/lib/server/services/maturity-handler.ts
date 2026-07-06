import { db } from '../db';
import { investments } from '../db/schema';
import { eq, and, sql, lte } from 'drizzle-orm';
import { createCapitalReturnPayout } from './payout-generator';

/**
 * MATURITY HANDLER SERVICE
 * 
 * Handles investments that have reached their end date
 * - Returns 90% of capital to user (10% platform fee)
 * - Marks investment as completed
 * - Creates final payout records
 */

export interface MaturityResult {
	success: boolean;
	investmentsMatured: number;
	totalCapitalReturned: number;
	errors: string[];
}

/**
 * Process all investments that have reached maturity
 */
export async function processMatureInvestments(): Promise<MaturityResult> {
	const result: MaturityResult = {
		success: true,
		investmentsMatured: 0,
		totalCapitalReturned: 0,
		errors: []
	};

	try {
		const now = new Date();

		// Find all active investments that have reached their end date
		const matureInvestments = await db
			.select({
				id: investments.id,
				userId: investments.userId,
				amount: investments.amount,
				profitAccrued: investments.profitAccrued,
				endDate: investments.endDate,
				payoutOption: investments.payoutOption
			})
			.from(investments)
			.where(
				and(
					eq(investments.status, 'active'),
					lte(investments.endDate, now)
				)
			);

		console.log(`[Maturity Handler] Found ${matureInvestments.length} mature investments`);

		for (const investment of matureInvestments) {
			try {
				await processMaturity(investment);
				result.investmentsMatured++;
				
				// Calculate 90% capital return
				const capitalReturn = parseFloat(investment.amount) * 0.9;
				result.totalCapitalReturned += capitalReturn;

				console.log(`[Maturity Handler] Investment ${investment.id} matured: returning $${capitalReturn.toFixed(2)}`);
			} catch (error) {
				const errorMsg = `Failed to process maturity for investment ${investment.id}: ${error}`;
				console.error(errorMsg);
				result.errors.push(errorMsg);
				result.success = false;
			}
		}

		console.log(`[Maturity Handler] Complete: ${result.investmentsMatured} matured, $${result.totalCapitalReturned.toFixed(2)} capital returned`);

		return result;
	} catch (error) {
		console.error('[Maturity Handler] Fatal error:', error);
		result.success = false;
		result.errors.push(`Fatal error: ${error}`);
		return result;
	}
}

/**
 * Process a single mature investment
 */
async function processMaturity(investment: any): Promise<void> {
	const investmentId = investment.id;
	const userId = investment.userId;
	const originalAmount = parseFloat(investment.amount);
	const finalProfit = parseFloat(investment.profitAccrued || '0');
	const payoutOption = investment.payoutOption?.toLowerCase();

	// Create capital return payout (90% of principal)
	await createCapitalReturnPayout(investmentId, userId, originalAmount);

	// If payout option is "end of term", create final profit payout
	if (payoutOption === 'end' || payoutOption === 'end_of_term') {
		if (finalProfit > 0) {
			await db.insert(require('../db/schema').payouts).values({
				investmentId,
				userId,
				amount: finalProfit.toString(),
				type: 'interest',
				status: 'pending',
				requestedAt: new Date(),
				createdAt: new Date()
			});

			console.log(`[Maturity Handler] Final profit payout created: $${finalProfit.toFixed(2)}`);
		}
	}

	// Mark investment as completed
	await db
		.update(investments)
		.set({
			status: 'completed',
			completedAt: new Date(),
			updatedAt: new Date()
		})
		.where(eq(investments.id, investmentId));

	console.log(`[Maturity Handler] Investment ${investmentId} marked as completed`);
}

/**
 * Calculate total expected profit for verification
 */
export function calculateExpectedProfit(
	principal: number,
	annualRate: number,
	durationDays: number
): number {
	// Simple interest: (Principal × Rate × Time) / (365 × 100)
	const totalProfit = (principal * annualRate * durationDays) / (365 * 100);
	return Math.round(totalProfit * 100) / 100;
}

/**
 * Verify that calculated profit matches expected profit
 * Useful for reconciliation and auditing
 */
export function verifyProfitAccuracy(
	calculatedProfit: number,
	expectedProfit: number,
	tolerancePercent: number = 0.1
): boolean {
	const difference = Math.abs(calculatedProfit - expectedProfit);
	const percentDiff = (difference / expectedProfit) * 100;
	
	if (percentDiff > tolerancePercent) {
		console.warn(`[Maturity Handler] Profit mismatch: calculated=$${calculatedProfit}, expected=$${expectedProfit}, diff=${percentDiff.toFixed(2)}%`);
		return false;
	}
	
	return true;
}
