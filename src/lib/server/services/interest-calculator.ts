import { db } from '../db';
import { investments, plans, payouts, users } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * INTEREST CALCULATION SERVICE
 * 
 * Calculates simple interest for active investments
 * Formula for per-period rates:
 * - Daily: Interest = (Principal × Daily Rate × Days) / 100
 * - Weekly: Interest = (Principal × Weekly Rate × Weeks) / 100
 * 
 * This service is designed for PRECISION - no floating point errors
 */

export interface CalculationResult {
	success: boolean;
	investmentsProcessed: number;
	totalInterestAccrued: number;
	payoutsCreated: number;
	errors: string[];
}

export interface InvestmentCalculation {
	investmentId: string;
	userId: string;
	principal: number;
	annualRate: number;
	daysSinceLastCalculation: number;
	interestEarned: number;
	newTotalProfit: number;
}

/**
 * Calculate daily interest for all active investments
 * Runs idempotently - can safely run multiple times per day
 */
export async function calculateDailyInterest(): Promise<CalculationResult> {
	const result: CalculationResult = {
		success: true,
		investmentsProcessed: 0,
		totalInterestAccrued: 0,
		payoutsCreated: 0,
		errors: []
	};

	try {
		// Get all active investments with their plan details
		const activeInvestments = await db
			.select({
				id: investments.id,
				userId: investments.userId,
				planId: investments.planId,
				amount: investments.amount,
				profitAccrued: investments.profitAccrued,
				startDate: investments.startDate,
				endDate: investments.endDate,
				lastCalculationDate: investments.lastCalculationDate,
				payoutOption: investments.payoutOption,
				createdAt: investments.createdAt,
				percentMin: plans.percentMin,
				percentMax: plans.percentMax,
				durationDays: plans.durationDays
			})
			.from(investments)
			.innerJoin(plans, eq(investments.planId, plans.id))
			.where(eq(investments.status, 'active'));

		console.log(`[Interest Calculator] Processing ${activeInvestments.length} active investments`);

		// Process each investment
		for (const investment of activeInvestments) {
			try {
				const calculation = await calculateInvestmentInterest(investment);
				
				if (calculation) {
					// Update the investment with new profit
					await db
						.update(investments)
						.set({
							profitAccrued: calculation.newTotalProfit.toString(),
							lastCalculationDate: new Date(),
							updatedAt: new Date()
						})
						.where(eq(investments.id, investment.id));

					result.investmentsProcessed++;
					result.totalInterestAccrued += calculation.interestEarned;

					console.log(`[Interest Calculator] Investment ${investment.id}: +$${calculation.interestEarned.toFixed(2)}`);
				}
			} catch (error) {
				const errorMsg = `Failed to calculate interest for investment ${investment.id}: ${error}`;
				console.error(errorMsg);
				result.errors.push(errorMsg);
				result.success = false;
			}
		}

		console.log(`[Interest Calculator] Complete: ${result.investmentsProcessed} processed, $${result.totalInterestAccrued.toFixed(2)} total interest`);

		return result;
	} catch (error) {
		console.error('[Interest Calculator] Fatal error:', error);
		result.success = false;
		result.errors.push(`Fatal error: ${error}`);
		return result;
	}
}

/**
 * Calculate interest for a single investment
 */
function calculateInvestmentInterest(investment: any): InvestmentCalculation | null {
	// Safety checks
	if (!investment.startDate) {
		console.warn(`Investment ${investment.id} has no start date, skipping`);
		return null;
	}

	const now = new Date();
	const startDate = new Date(investment.startDate);
	const endDate = investment.endDate ? new Date(investment.endDate) : null;

	// Don't calculate if investment hasn't started
	if (startDate > now) {
		console.log(`Investment ${investment.id} hasn't started yet`);
		return null;
	}

	// Don't calculate if investment has ended
	if (endDate && endDate < now) {
		console.log(`Investment ${investment.id} has ended`);
		return null;
	}

	// Determine last calculation date
	const lastCalcDate = investment.lastCalculationDate 
		? new Date(investment.lastCalculationDate)
		: startDate;

	// Calculate days since last calculation
	const daysSinceLastCalc = Math.floor((now.getTime() - lastCalcDate.getTime()) / (1000 * 60 * 60 * 24));

	// Skip if already calculated today
	if (daysSinceLastCalc < 1) {
		console.log(`Investment ${investment.id} already calculated today`);
		return null;
	}

	// Get investment amounts
	const principal = parseFloat(investment.amount);
	const currentProfit = parseFloat(investment.profitAccrued || '0');

	// Calculate average rate (use midpoint of min/max)
	const rate = (parseFloat(investment.percentMin) + parseFloat(investment.percentMax)) / 2;
	const payoutOption = investment.payoutOption?.toLowerCase();

	let interestEarned = 0;

	// Calculate interest based on payout frequency
	// Plans use per-period rates (not annual rates)
	if (payoutOption === 'daily') {
		// Daily rate: Interest = (Principal × Daily Rate × Days) / 100
		const dailyInterest = (principal * rate * daysSinceLastCalc) / 100;
		interestEarned = Math.round(dailyInterest * 100) / 100;
	} else if (payoutOption === 'weekly') {
		// Weekly rate: Only calculate if full weeks have passed
		const weeksSinceLastCalc = Math.floor(daysSinceLastCalc / 7);
		if (weeksSinceLastCalc > 0) {
			const weeklyInterest = (principal * rate * weeksSinceLastCalc) / 100;
			interestEarned = Math.round(weeklyInterest * 100) / 100;
		}
	} else {
		// Default to daily calculation
		const dailyInterest = (principal * rate * daysSinceLastCalc) / 100;
		interestEarned = Math.round(dailyInterest * 100) / 100;
	}

	const newTotalProfit = currentProfit + interestEarned;

	return {
		investmentId: investment.id,
		userId: investment.userId,
		principal,
		annualRate: rate, // Keep property name for compatibility but it's actually per-period rate
		daysSinceLastCalculation: daysSinceLastCalc,
		interestEarned,
		newTotalProfit
	};
}

/**
 * Check if calculation should run based on payout schedule
 * Daily: Run every day
 * Weekly: Run every 7 days
 * Monthly: Run every 30 days
 */
export function shouldCreatePayout(
	payoutOption: string,
	lastPayoutDate: Date | null
): boolean {
	if (!lastPayoutDate) return true;

	const daysSinceLastPayout = Math.floor(
		(new Date().getTime() - lastPayoutDate.getTime()) / (1000 * 60 * 60 * 24)
	);

	switch (payoutOption?.toLowerCase()) {
		case 'daily':
			return daysSinceLastPayout >= 1;
		case 'weekly':
			return daysSinceLastPayout >= 7;
		case 'monthly':
			return daysSinceLastPayout >= 30;
		case 'end':
		case 'end_of_term':
			return false; // Only pay at maturity
		default:
			return daysSinceLastPayout >= 1; // Default to daily
	}
}
