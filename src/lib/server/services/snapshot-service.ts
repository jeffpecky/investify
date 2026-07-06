import { db } from '$lib/server/db';
import { users, investments, referrals, dailyStats } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Creates or updates a daily snapshot for a user's current stats
 * Call this when:
 * - User registers (creates initial snapshot with zeros)
 * - User makes a deposit
 * - User creates an investment
 * - Any significant financial activity occurs
 */
export async function createUserSnapshot(userId: string): Promise<void> {
	try {
		const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

		// Get user
		const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
		if (!user) {
			console.error(`User ${userId} not found`);
			return;
		}

		// Get current stats
		const userInvestments = await db.select().from(investments).where(eq(investments.userId, userId));
		const userReferrals = await db.select().from(referrals).where(eq(referrals.referredId, userId));

		// Calculate current values
		const totalInvested = userInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
		const walletBalance = Number(user.walletBalance);
		const totalProfit = userInvestments.reduce((sum, inv) => sum + Number(inv.profitAccrued), 0);
		const referralEarnings = userReferrals.reduce((sum, ref) => sum + Number(ref.bonusEarned), 0);

		// Check if snapshot already exists for today
		const existingSnapshot = await db
			.select()
			.from(dailyStats)
			.where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, today)))
			.limit(1);

		if (existingSnapshot.length > 0) {
			// Update existing snapshot (user made multiple activities today)
			await db
				.update(dailyStats)
				.set({
					totalInvested: totalInvested.toFixed(2),
					totalProfit: totalProfit.toFixed(2),
					walletBalance: walletBalance.toFixed(2),
					referralEarnings: referralEarnings.toFixed(2)
				})
				.where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, today)));

			console.log(`📊 Updated snapshot for user ${userId} on ${today}`);
		} else {
			// Create new snapshot for today
			await db.insert(dailyStats).values({
				userId,
				date: today,
				totalInvested: totalInvested.toFixed(2),
				totalProfit: totalProfit.toFixed(2),
				walletBalance: walletBalance.toFixed(2),
				referralEarnings: referralEarnings.toFixed(2),
				createdAt: new Date()
			});

			console.log(`📊 Created new snapshot for user ${userId} on ${today}`);
		}
	} catch (error) {
		console.error(`Failed to create snapshot for user ${userId}:`, error);
		// Don't throw - snapshots are important but shouldn't break main functionality
	}
}

/**
 * Creates initial zero snapshot for a new user
 * Call this immediately after user registration
 */
export async function createInitialSnapshot(userId: string): Promise<void> {
	try {
		const today = new Date().toISOString().split('T')[0];

		// Check if any snapshot exists
		const existingSnapshots = await db
			.select()
			.from(dailyStats)
			.where(eq(dailyStats.userId, userId))
			.limit(1);

		if (existingSnapshots.length === 0) {
			// Create initial snapshot with zeros
			await db.insert(dailyStats).values({
				userId,
				date: today,
				totalInvested: '0.00',
				totalProfit: '0.00',
				walletBalance: '0.00',
				referralEarnings: '0.00',
				createdAt: new Date()
			});

			console.log(`📊 Created initial snapshot for new user ${userId}`);
		}
	} catch (error) {
		console.error(`Failed to create initial snapshot for user ${userId}:`, error);
	}
}
