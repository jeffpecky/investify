import { db } from './index';
import { users, investments, referrals, dailyStats } from './schema';
import { eq } from 'drizzle-orm';

async function seedHistoricalData() {
	console.log('\n📊 Generating 30 days of historical data...');

	// Get all non-admin users
	const allUsers = await db.select().from(users).where(eq(users.role, 'user'));

	const today = new Date();
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(today.getDate() - 30);

	// Create a deterministic seed based on user ID for reproducible data
	function seededRandom(seed: string): () => number {
		let s = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
		return () => {
			s = (s * 1103515245 + 12345) & 0x7fffffff;
			return s / 0x7fffffff;
		};
	}

	// Clear existing historical data
	await db.delete(dailyStats);
	console.log('   Cleared existing historical data');

	for (const user of allUsers) {
		// Get current stats for this user
		const userInvestments = await db.select().from(investments).where(eq(investments.userId, user.id));
		const userReferrals = await db.select().from(referrals).where(eq(referrals.referredId, user.id));

		// Calculate current values
		const currentTotalInvested = userInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
		const currentWalletBalance = Number(user.walletBalance);
		const currentTotalProfit = userInvestments.reduce((sum, inv) => sum + Number(inv.profitAccrued), 0);
		const currentReferralEarnings = userReferrals.reduce((sum, ref) => sum + Number(ref.bonusEarned), 0);

		// Skip users with no investments
		if (currentTotalInvested === 0 && currentWalletBalance === 0) {
			console.log(`   ⏭ ${user.firstName} ${user.lastName}: Skipped (no data)`);
			continue;
		}

		// Use user ID as seed for reproducible random data
		const random = seededRandom(user.id);

		// Generate 30 days of data with gradual growth
		const records = [];
		for (let i = 0; i < 30; i++) {
			const date = new Date(thirtyDaysAgo);
			date.setDate(thirtyDaysAgo.getDate() + i);

			// Calculate growth factor (0.5 to 1.0) - lower values earlier, higher later
			const dayFactor = 0.5 + (i / 29) * 0.5;

			// Add some randomness (±10%)
			const noise = 1 + (random() - 0.5) * 0.2;

			// Calculate values for this day
			const dayInvested = currentTotalInvested * dayFactor * noise;
			const dayBalance = currentWalletBalance * dayFactor * noise;
			const dayProfit = currentTotalProfit * dayFactor * noise;
			const dayReferral = currentReferralEarnings * dayFactor * noise;

			// Format date as YYYY-MM-DD
			const dateStr = date.toISOString().split('T')[0];

			records.push({
				userId: user.id,
				date: dateStr,
				totalInvested: Math.max(0, dayInvested).toFixed(2),
				totalProfit: Math.max(0, dayProfit).toFixed(2),
				walletBalance: Math.max(0, dayBalance).toFixed(2),
				referralEarnings: Math.max(0, dayReferral).toFixed(2),
				createdAt: new Date()
			});
		}

		// Insert records in batch
		if (records.length > 0) {
			await db.insert(dailyStats).values(records);
			console.log(`   ✓ ${user.firstName} ${user.lastName}: ${records.length} days`);
		}
	}

	console.log('   📈 Historical data generation complete');
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
	import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}`;
if (isMainModule || process.argv[1]?.endsWith('seed-historical.ts')) {
	seedHistoricalData()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error('❌ Seed failed:', error);
			process.exit(1);
		});
}
