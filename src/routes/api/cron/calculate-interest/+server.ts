import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calculateDailyInterest } from '$lib/server/services/interest-calculator';
import { generatePayouts } from '$lib/server/services/payout-generator';
import { processMatureInvestments } from '$lib/server/services/maturity-handler';

/**
 * AUTOMATED INTEREST CALCULATION CRON ENDPOINT
 * 
 * This endpoint should be called daily by a cron service (e.g., Vercel Cron)
 * 
 * Protected by CRON_SECRET environment variable
 * 
 * Schedule: Daily at 00:00 UTC (midnight)
 * 
 * Process:
 * 1. Calculate interest for all active investments
 * 2. Generate payout records based on schedule
 * 3. Process mature investments (capital return)
 * 
 * @example Vercel Cron configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/calculate-interest",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 * 
 * @example Manual trigger (for testing):
 * curl -X POST https://your-domain.com/api/cron/calculate-interest \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */

export const POST: RequestHandler = async ({ request }) => {
	const startTime = Date.now();
	
	console.log('═══════════════════════════════════════════════');
	console.log('[CRON] Interest Calculation Started');
	console.log(`[CRON] Timestamp: ${new Date().toISOString()}`);
	console.log('═══════════════════════════════════════════════');

	try {
		// 1. AUTHORIZATION CHECK
		const authHeader = request.headers.get('authorization');
		const cronSecret = process.env.CRON_SECRET;

		// Require CRON_SECRET to be set in production
		if (!cronSecret) {
			console.error('[CRON] ERROR: CRON_SECRET not configured');
			return json(
				{ 
					success: false, 
					error: 'CRON_SECRET not configured. Please set this environment variable.' 
				},
				{ status: 500 }
			);
		}

		// Verify authorization token
		const providedToken = authHeader?.replace('Bearer ', '');
		if (providedToken !== cronSecret) {
			console.warn('[CRON] UNAUTHORIZED: Invalid token provided');
			return json(
				{ success: false, error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		console.log('[CRON] ✓ Authorization verified');

		// 2. CALCULATE DAILY INTEREST
		console.log('\n[CRON] Step 1: Calculating daily interest...');
		const interestResult = await calculateDailyInterest();
		
		console.log(`[CRON] Interest calculation: ${interestResult.success ? '✓ SUCCESS' : '✗ FAILED'}`);
		console.log(`[CRON] - Investments processed: ${interestResult.investmentsProcessed}`);
		console.log(`[CRON] - Total interest accrued: $${interestResult.totalInterestAccrued.toFixed(2)}`);
		
		if (interestResult.errors.length > 0) {
			console.error(`[CRON] - Errors: ${interestResult.errors.length}`);
			interestResult.errors.forEach(err => console.error(`[CRON]   • ${err}`));
		}

		// 3. GENERATE PAYOUTS
		console.log('\n[CRON] Step 2: Generating payouts...');
		const payoutResult = await generatePayouts();
		
		console.log(`[CRON] Payout generation: ${payoutResult.success ? '✓ SUCCESS' : '✗ FAILED'}`);
		console.log(`[CRON] - Payouts created: ${payoutResult.payoutsCreated}`);
		console.log(`[CRON] - Total payout amount: $${payoutResult.totalAmount.toFixed(2)}`);
		
		if (payoutResult.errors.length > 0) {
			console.error(`[CRON] - Errors: ${payoutResult.errors.length}`);
			payoutResult.errors.forEach(err => console.error(`[CRON]   • ${err}`));
		}

		// 4. PROCESS MATURE INVESTMENTS
		console.log('\n[CRON] Step 3: Processing mature investments...');
		const maturityResult = await processMatureInvestments();
		
		console.log(`[CRON] Maturity processing: ${maturityResult.success ? '✓ SUCCESS' : '✗ FAILED'}`);
		console.log(`[CRON] - Investments matured: ${maturityResult.investmentsMatured}`);
		console.log(`[CRON] - Capital returned: $${maturityResult.totalCapitalReturned.toFixed(2)}`);
		
		if (maturityResult.errors.length > 0) {
			console.error(`[CRON] - Errors: ${maturityResult.errors.length}`);
			maturityResult.errors.forEach(err => console.error(`[CRON]   • ${err}`));
		}

		// 5. SUMMARY
		const executionTime = Date.now() - startTime;
		const overallSuccess = interestResult.success && payoutResult.success && maturityResult.success;

		console.log('\n═══════════════════════════════════════════════');
		console.log(`[CRON] Interest Calculation Complete: ${overallSuccess ? '✓ SUCCESS' : '✗ PARTIAL FAILURE'}`);
		console.log(`[CRON] Execution time: ${executionTime}ms`);
		console.log('═══════════════════════════════════════════════\n');

		// Return detailed summary
		return json({
			success: overallSuccess,
			timestamp: new Date().toISOString(),
			executionTimeMs: executionTime,
			summary: {
				interestCalculation: {
					success: interestResult.success,
					investmentsProcessed: interestResult.investmentsProcessed,
					totalInterestAccrued: interestResult.totalInterestAccrued,
					errors: interestResult.errors
				},
				payoutGeneration: {
					success: payoutResult.success,
					payoutsCreated: payoutResult.payoutsCreated,
					totalAmount: payoutResult.totalAmount,
					errors: payoutResult.errors
				},
				maturityProcessing: {
					success: maturityResult.success,
					investmentsMatured: maturityResult.investmentsMatured,
					totalCapitalReturned: maturityResult.totalCapitalReturned,
					errors: maturityResult.errors
				}
			}
		});

	} catch (error) {
		const executionTime = Date.now() - startTime;
		
		console.error('\n═══════════════════════════════════════════════');
		console.error('[CRON] FATAL ERROR');
		console.error('[CRON] Error:', error);
		console.error('[CRON] Stack:', error instanceof Error ? error.stack : 'No stack trace');
		console.error(`[CRON] Execution time: ${executionTime}ms`);
		console.error('═══════════════════════════════════════════════\n');

		return json(
			{
				success: false,
				error: 'Fatal error during interest calculation',
				message: error instanceof Error ? error.message : String(error),
				timestamp: new Date().toISOString(),
				executionTimeMs: executionTime
			},
			{ status: 500 }
		);
	}
};

// GET endpoint for health check (no auth required)
export const GET: RequestHandler = async () => {
	return json({
		service: 'Interest Calculation Cron',
		status: 'online',
		endpoint: '/api/cron/calculate-interest',
		method: 'POST',
		authentication: 'Required (Bearer token in Authorization header)',
		schedule: 'Daily at 00:00 UTC',
		timestamp: new Date().toISOString()
	});
};
