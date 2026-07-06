import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, investments, referrals, dailyStats } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ request }) => {
	// Verify cron secret for security
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		console.log('🕐 Starting daily stats snapshot...');

		// Get all users (including new ones)
		const allUsers = await db.select().from(users);

		const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
		let snapshotCount = 0;

		for (const user of allUsers) {
			// Get current stats for this user
			const userInvestments = await db.select().from(investments).where(eq(investments.userId, user.id));
			const userReferrals = await db.select().from(referrals).where(eq(referrals.referredId, user.id));

			// Calculate current values
			const totalInvested = userInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
			const walletBalance = Number(user.walletBalance);
			const totalProfit = userInvestments.reduce((sum, inv) => sum + Number(inv.profitAccrued), 0);
			const referralEarnings = userReferrals.reduce((sum, ref) => sum + Number(ref.bonusEarned), 0);

			// Check if snapshot already exists for today
			const existingSnapshot = await db
				.select()
				.from(dailyStats)
				.where(and(eq(dailyStats.userId, user.id), eq(dailyStats.date, today)))
				.limit(1);

			if (existingSnapshot.length === 0) {
				// Create new snapshot for today
				await db.insert(dailyStats).values({
					userId: user.id,
					date: today,
					totalInvested: totalInvested.toFixed(2),
					totalProfit: totalProfit.toFixed(2),
					walletBalance: walletBalance.toFixed(2),
					referralEarnings: referralEarnings.toFixed(2),
					createdAt: new Date()
				});

				snapshotCount++;
			}
		}

		console.log(`✅ Created ${snapshotCount} daily snapshots`);

		return json({
			success: true,
			message: `Created ${snapshotCount} snapshots for ${allUsers.length} users`,
			date: today
		});
	} catch (error) {
		console.error('❌ Snapshot creation failed:', error);
		return json({ error: 'Snapshot creation failed' }, { status: 500 });
	}
};
