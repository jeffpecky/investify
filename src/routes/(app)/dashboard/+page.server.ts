import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { investments, plans, withdrawals, referrals, payouts, dailyStats } from '$lib/server/db/schema';
import { eq, sql, and, desc, gte } from 'drizzle-orm';
import { safeQuery } from '$lib/server/db/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	// Get user investments with plan details
	const userInvestments = await safeQuery(
		() =>
			db
				.select({
					id: investments.id,
					amount: investments.amount,
					status: investments.status,
					profitAccrued: investments.profitAccrued,
					startDate: investments.startDate,
					endDate: investments.endDate,
					planId: investments.planId,
					planName: plans.name,
					planCategory: plans.category,
					createdAt: investments.createdAt
				})
				.from(investments)
				.leftJoin(plans, eq(investments.planId, plans.id))
				.where(eq(investments.userId, user.id))
				.orderBy(desc(investments.createdAt))
				.limit(10),
		'Failed to load user investments'
	);

	// Get investment statistics
	const stats = await safeQuery(
		() =>
			db
				.select({
					totalInvested: sql<string>`COALESCE(SUM(CASE WHEN ${investments.status} IN ('active', 'completed') THEN ${investments.amount}::numeric ELSE 0 END), 0)`,
					totalProfit: sql<string>`COALESCE(SUM(${investments.profitAccrued}::numeric), 0)`,
					activeCount: sql<number>`COUNT(CASE WHEN ${investments.status} = 'active' THEN 1 END)`
				})
				.from(investments)
				.where(eq(investments.userId, user.id)),
		'Failed to load investment stats'
	);

	// Get portfolio distribution (group by plan)
	const portfolioDistribution = await safeQuery(
		() =>
			db
				.select({
					planName: plans.name,
					planId: plans.id,
					totalAmount: sql<string>`COALESCE(SUM(${investments.amount}::numeric), 0)`,
					count: sql<number>`COUNT(*)`
				})
				.from(investments)
				.leftJoin(plans, eq(investments.planId, plans.id))
				.where(and(
					eq(investments.userId, user.id),
					sql`${investments.status} IN ('active', 'completed')`
				))
				.groupBy(plans.id, plans.name),
		'Failed to load portfolio distribution'
	);

	// Get referral earnings
	const referralEarnings = await safeQuery(
		() =>
			db
				.select({
					totalEarnings: sql<string>`COALESCE(SUM(${referrals.bonusEarned}::numeric), 0)`,
					count: sql<number>`COUNT(*)`
				})
				.from(referrals)
				.where(eq(referrals.referrerId, user.id)),
		'Failed to load referral earnings'
	);

	// Get recent activity (last 10 transactions across investments, withdrawals, payouts)
	const recentInvestments = await safeQuery(
		() =>
			db
				.select({
					type: sql<string>`'investment'`,
					planName: plans.name,
					amount: investments.amount,
					status: investments.status,
					createdAt: investments.createdAt
				})
				.from(investments)
				.leftJoin(plans, eq(investments.planId, plans.id))
				.where(eq(investments.userId, user.id))
				.orderBy(desc(investments.createdAt))
				.limit(5),
		'Failed to load recent investments'
	);

	const recentWithdrawals = await safeQuery(
		() =>
			db
				.select({
					type: sql<string>`'withdrawal'`,
					planName: sql<string>`'Profit'`,
					amount: withdrawals.amount,
					status: withdrawals.status,
					createdAt: withdrawals.createdAt
				})
				.from(withdrawals)
				.where(eq(withdrawals.userId, user.id))
				.orderBy(desc(withdrawals.createdAt))
				.limit(5),
		'Failed to load recent withdrawals'
	);

	// Get user's active investment plans (only plans the user is currently invested in)
	const activePlans = await safeQuery(
		() =>
			db
				.select({
					id: plans.id,
					name: plans.name,
					category: plans.category,
					percentMin: plans.percentMin,
					percentMax: plans.percentMax,
					investedAmount: sql<string>`COALESCE(SUM(${investments.amount}::numeric), 0)`,
					investmentCount: sql<number>`COUNT(*)`
				})
				.from(investments)
				.innerJoin(plans, eq(investments.planId, plans.id))
				.where(and(
					eq(investments.userId, user.id),
					eq(investments.status, 'active')
				))
				.groupBy(plans.id, plans.name, plans.category, plans.percentMin, plans.percentMax)
				.orderBy(desc(sql`SUM(${investments.amount}::numeric)`))
				.limit(5),
		'Failed to load active plans'
	);

	const withdrawalStats = await safeQuery(
		() =>
			db
				.select({
					pending: sql<number>`COUNT(*)`
				})
				.from(withdrawals)
				.where(and(eq(withdrawals.userId, user.id), eq(withdrawals.status, 'pending'))),
		'Failed to load withdrawal stats'
	);

	const statsData = stats?.[0] || { totalInvested: '0', totalProfit: '0', activeCount: 0 };
	const withdrawalData = withdrawalStats?.[0] || { pending: 0 };
	const referralData = referralEarnings?.[0] || { totalEarnings: '0', count: 0 };

	// Get historical data for the last 30 days for sparkline charts and percentage calculations
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

	const historicalStats = await safeQuery(
		() =>
			db
				.select({
					date: dailyStats.date,
					totalInvested: dailyStats.totalInvested,
					walletBalance: dailyStats.walletBalance,
					totalProfit: dailyStats.totalProfit,
					referralEarnings: dailyStats.referralEarnings
				})
				.from(dailyStats)
				.where(and(
					eq(dailyStats.userId, user.id),
					gte(dailyStats.date, thirtyDaysAgoStr)
				))
				.orderBy(dailyStats.date),
		'Failed to load historical stats'
	);

	// Calculate real percentage changes (today vs 7 days ago)
	const todayStr = new Date().toISOString().split('T')[0];
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

	// For current values, prefer historical data but fallback to actual current stats
	// This ensures new users without historical data still see their real values
	const todaySnapshot = historicalStats?.find(s => s.date === todayStr) || historicalStats?.[historicalStats.length - 1];
	const previousSnapshot = historicalStats?.find(s => s.date === sevenDaysAgoStr);

	function calculatePercentageChange(current: number, previous: number): { percent: number; delta: number } {
		if (previous === 0) {
			// If no previous data, show current value as delta with 0% change
			return { percent: 0, delta: current };
		}
		const delta = current - previous;
		const percent = (delta / previous) * 100;
		return { percent, delta };
	}

	// Use actual current values from database (statsData) as fallback if no historical snapshot exists
	// This ensures new users without snapshots still see their real current values
	const currentInvested = todaySnapshot ? Number(todaySnapshot.totalInvested) : parseFloat(statsData.totalInvested || '0');
	const currentBalance = todaySnapshot ? Number(todaySnapshot.walletBalance) : parseFloat(user.walletBalance);
	const currentProfit = todaySnapshot ? Number(todaySnapshot.totalProfit) : parseFloat(statsData.totalProfit || '0');
	const currentReferral = todaySnapshot ? Number(todaySnapshot.referralEarnings) : parseFloat(referralData.totalEarnings || '0');

	const previousInvested = previousSnapshot ? Number(previousSnapshot.totalInvested) : 0;
	const previousBalance = previousSnapshot ? Number(previousSnapshot.walletBalance) : 0;
	const previousProfit = previousSnapshot ? Number(previousSnapshot.totalProfit) : 0;
	const previousReferral = previousSnapshot ? Number(previousSnapshot.referralEarnings) : 0;

	const investedChange = calculatePercentageChange(currentInvested, previousInvested);
	const balanceChange = calculatePercentageChange(currentBalance, previousBalance);
	const profitChange = calculatePercentageChange(currentProfit, previousProfit);
	const referralChange = calculatePercentageChange(currentReferral, previousReferral);

	// Prepare sparkline data (last 7 values for the chart)
	// If no historical data exists, create a single-point array with current values
	const hasHistoricalData = historicalStats && historicalStats.length > 0;
	
	const sparklineData = {
		invested: hasHistoricalData 
			? historicalStats.slice(-7).map(s => Number(s.totalInvested))
			: currentInvested > 0 ? [currentInvested] : [],
		balance: hasHistoricalData
			? historicalStats.slice(-7).map(s => Number(s.walletBalance))
			: currentBalance > 0 ? [currentBalance] : [],
		profit: hasHistoricalData
			? historicalStats.slice(-7).map(s => Number(s.totalProfit))
			: currentProfit > 0 ? [currentProfit] : [],
		referral: hasHistoricalData
			? historicalStats.slice(-7).map(s => Number(s.referralEarnings))
			: currentReferral > 0 ? [currentReferral] : []
	};

	// Combine and sort recent activity
	const allActivity = [
		...(recentInvestments || []),
		...(recentWithdrawals || [])
	].sort((a, b) => {
		const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
		const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
		return dateB - dateA;
	}).slice(0, 6);

	// Calculate portfolio percentages
	const totalPortfolio = portfolioDistribution?.reduce((sum, item) => sum + parseFloat(item.totalAmount), 0) || 0;
	const portfolioData = portfolioDistribution?.map(item => ({
		planName: item.planName || 'Unknown',
		amount: parseFloat(item.totalAmount),
		percentage: totalPortfolio > 0 ? (parseFloat(item.totalAmount) / totalPortfolio * 100).toFixed(1) : '0',
		count: item.count
	})) || [];

	return {
		breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
		user,
		investments: userInvestments || [],
		activePlans: activePlans || [],
		recentActivity: allActivity,
		portfolioDistribution: portfolioData,
		stats: {
			totalInvested: parseFloat(statsData.totalInvested || '0'),
			totalProfit: parseFloat(statsData.totalProfit || '0'),
			referralEarnings: parseFloat(referralData.totalEarnings || '0'),
			activeInvestments: statsData.activeCount || 0,
			pendingWithdrawals: withdrawalData.pending || 0,
			walletBalance: parseFloat(user.walletBalance),
			tokenBalance: parseFloat(user.tokenBalance),
			depositedBalance: parseFloat(user.depositedBalance || '0')
		},
		historical: {
			sparklineData,
			changes: {
				invested: investedChange,
				balance: balanceChange,
				profit: profitChange,
				referral: referralChange
			}
		}
	};
};
