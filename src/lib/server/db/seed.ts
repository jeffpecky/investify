import { db } from './index';
import {
	users,
	plans,
	planCategories,
	planFeatures,
	payoutOptions,
	investments,
	wallets,
	platformWallets,
	withdrawals,
	referrals,
	blogPosts,
	userGroups,
	siteSettings,
	aiSettings,
	payouts,
	dailyStats
} from './schema';
import { hashPassword } from '../auth/password';
import { eq } from 'drizzle-orm';

export async function seed() {
	console.log('🌱 Starting database seed...');

	// 1. Create admin user
	const [admin] = await db
		.insert(users)
		.values({
			firstName: 'Admin',
			lastName: 'User',
			email: 'admin@ethercore.org',
			passwordHash: await hashPassword('admin123'),
			role: 'admin',
			emailVerifiedAt: new Date(),
			referralCode: 'ADMIN001',
			kycStatus: 'approved'
		})
		.returning();
	console.log('✅ Admin user created');

	// 2. Create test user with realistic balances
	const [user1] = await db
		.insert(users)
		.values({
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			passwordHash: await hashPassword('password123'),
			role: 'user',
			emailVerifiedAt: new Date(),
			referralCode: 'JOHN001',
			walletBalance: '15000.00',
			tokenBalance: '5000.00',
			group: 'Ambassador',
			kycStatus: 'approved'
		})
		.returning();
	console.log('✅ Test user created');

	// 3. Create a second test user (referred by user1)
	const [user2] = await db
		.insert(users)
		.values({
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'jane@example.com',
			passwordHash: await hashPassword('password123'),
			role: 'user',
			emailVerifiedAt: new Date(),
			referralCode: 'JANE001',
			referredBy: user1.id,
			walletBalance: '5000.00',
			tokenBalance: '2000.00',
			group: 'Elite Partner',
			kycStatus: 'approved'
		})
		.returning();
	console.log('✅ Second test user created');

	// 4. Create categories
	const [cat1] = await db.insert(planCategories).values({ name: 'Rare' }).returning();
	const [cat2] = await db.insert(planCategories).values({ name: 'Business' }).returning();
	const [cat3] = await db.insert(planCategories).values({ name: 'Property' }).returning();
	const [cat4] = await db.insert(planCategories).values({ name: 'Reserved' }).returning();
	const [cat5] = await db.insert(planCategories).values({ name: 'Anniversary' }).returning();
	const [cat6] = await db.insert(planCategories).values({ name: 'committee' }).returning();
	console.log('✅ Categories created');

	// 5. Create features
	const [feat1] = await db
		.insert(planFeatures)
		.values({
			name: '24/7 Support',
			description: 'Round-the-clock customer support'
		})
		.returning();
	const [feat2] = await db
		.insert(planFeatures)
		.values({
			name: 'Daily Payouts',
			description: 'Receive payouts every day'
		})
		.returning();
	const [feat3] = await db
		.insert(planFeatures)
		.values({
			name: 'Compounding Available',
			description: 'Automatic reinvestment option (40% after 180 days)'
		})
		.returning();
	const [feat4] = await db
		.insert(planFeatures)
		.values({
			name: 'Capital Return',
			description: '90% of principal returned at term end'
		})
		.returning();
	console.log('✅ Features created');

	// 6. Create payout options
	await db.insert(payoutOptions).values([{ name: 'Daily' }, { name: 'Weekly' }, { name: 'Monthly' }]);
	console.log('✅ Payout options created');

	// 7. Create plans according to spec
	// Plans based on the provided image specifications
	// Returns are calculated as: percentage per period × number of runs
	const plansData = [
		{
			name: 'RARE PLAN',
			category: 'Rare',
			minAmount: '100.00',
			maxAmount: '2999.00',
			durationDays: 1,
			percentMin: '5.00',
			percentMax: '5.00',
			payoutOptions: ['Daily'],
			features: ['Capital Return', 'Period Returns', 'Runs 1 Time', '24-hour support response time', '24/7 Withdrawals'],
			referralLevels: [{ level: 1, percent: 10 }],
			status: 'active',
			recommended: false
		},
		{
			name: 'Business PLAN',
			category: 'Business',
			minAmount: '5000.00',
			maxAmount: '9999.00',
			durationDays: 4,
			percentMin: '20.00',
			percentMax: '20.00',
			payoutOptions: ['Daily'],
			features: ['Capital Return', 'Period Returns', 'Runs 4 Times', '24-hour support response time', '24/7 Withdrawals'],
			referralLevels: [
				{ level: 1, percent: 10 },
				{ level: 2, percent: 10 }
			],
			status: 'active',
			recommended: false
		},
		{
			name: 'PROPERTY PLAN',
			category: 'Property',
			minAmount: '10000.00',
			maxAmount: '100000.00',
			durationDays: 4,
			percentMin: '40.00',
			percentMax: '40.00',
			payoutOptions: ['Daily'],
			features: ['Capital Return', 'Period Returns', 'Runs 4 Times', '24-hour support response time', '24/7 Withdrawals'],
			referralLevels: [
				{ level: 1, percent: 10 },
				{ level: 2, percent: 10 }
			],
			status: 'active',
			recommended: false
		},
		{
			name: 'RESERVED PLAN',
			category: 'Reserved',
			minAmount: '40000.00',
			maxAmount: '400000.00',
			durationDays: 49,
			percentMin: '80.00',
			percentMax: '80.00',
			payoutOptions: ['Weekly'],
			features: ['Capital Return', 'Period Returns', 'Runs 7 Times', '24-hour support response time', '24/7 Withdrawals'],
			referralLevels: [
				{ level: 1, percent: 10 },
				{ level: 2, percent: 10 }
			],
			status: 'active',
			recommended: false
		},
		{
			name: 'Anniversary',
			category: 'Anniversary',
			minAmount: '3000.00',
			maxAmount: '100000.00',
			durationDays: 3,
			percentMin: '15.00',
			percentMax: '15.00',
			payoutOptions: ['Daily'],
			features: ['Capital Return', 'Period Returns', 'Runs 3 Times', '24-hour support response time', '24/7 Withdrawals'],
			referralLevels: [
				{ level: 1, percent: 10 },
				{ level: 2, percent: 10 }
			],
			status: 'active',
			recommended: false
		},
		{
			name: 'JOINT COMMITTEE',
			category: 'committee',
			minAmount: '50000.00',
			maxAmount: '300000.00',
			durationDays: 3,
			percentMin: '120.00',
			percentMax: '120.00',
			payoutOptions: ['Daily'],
			features: ['Capital Return', 'Period Returns', 'Runs 3 Times', '24-hour support response time', '24/7 Withdrawals'],
			referralLevels: [
				{ level: 1, percent: 10 },
				{ level: 2, percent: 10 }
			],
			status: 'active',
			recommended: false
		}
	];

	const createdPlans = [];
	for (const plan of plansData) {
		const [created] = await db.insert(plans).values(plan).returning();
		createdPlans.push(created);
	}
	console.log('✅ Plans created');

	// 8. Create investments for test user
	// Investment: $8,000 on Business PLAN (4 days, 20% daily)
	// Expected profit: $8,000 × 20% × 4 = $6,400 (simple interest)
	// Capital return: 90% of $8,000 = $7,200 at term end
	const [investment1] = await db
		.insert(investments)
		.values({
			userId: user1.id,
			planId: createdPlans[1].id, // Business PLAN
			amount: '8000.00',
			paymentMethod: 'crypto',
			cryptoSymbol: 'BTC',
			cryptoAmount: '0.25',
			payoutOption: 'Daily',
			status: 'active',
			profitAccrued: '4800.00', // 3 days elapsed
			totalExpectedProfit: '6400.00',
			startDate: '2026-07-01',
			endDate: '2026-07-05'
		})
		.returning();
	console.log('✅ Investments created');

	// 9. Create a completed investment for user2
	const [investment2] = await db
		.insert(investments)
		.values({
			userId: user2.id,
			planId: createdPlans[0].id, // RARE PLAN
			amount: '1000.00',
			paymentMethod: 'crypto',
			cryptoSymbol: 'ETH',
			cryptoAmount: '0.5',
			payoutOption: 'Daily',
			status: 'completed',
			profitAccrued: '50.00',
			totalExpectedProfit: '50.00',
			startDate: '2026-06-01',
			endDate: '2026-06-02'
		})
		.returning();
	console.log('✅ Completed investment created');

	// 10. Create payouts for completed investment
	// RARE PLAN: 5% daily for 1 day = $50 payout
	await db.insert(payouts).values({
		investmentId: investment2.id,
		userId: user2.id,
		amount: '50.00',
		date: '2026-06-02',
		capitalGrowth: '50.00',
		payoutAmount: '50.00',
		roiPercent: '5.00',
		status: 'paid'
	});
	console.log('✅ Payouts created');

	// 11. Create user wallets
	await db.insert(wallets).values([
		{
			userId: user1.id,
			cryptocurrency: 'BTC',
			name: 'Bitcoin Wallet',
			address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
		},
		{
			userId: user1.id,
			cryptocurrency: 'ETH',
			name: 'Ethereum Wallet',
			address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
		},
		{
			userId: user2.id,
			cryptocurrency: 'BTC',
			name: 'Bitcoin Wallet',
			address: 'bc1quser2exampleaddress123456789'
		}
	]);
	console.log('✅ User wallets created');

	// 12. Create platform wallets
	await db.insert(platformWallets).values([
		{
			cryptocurrency: 'BTC',
			name: 'Platform Bitcoin',
			address: 'bc1qplatformaddressbtcexample123456',
			isActive: true
		},
		{
			cryptocurrency: 'ETH',
			name: 'Platform Ethereum',
			address: '0xPlatformAddressETHExample123456789',
			isActive: true
		},
		{
			cryptocurrency: 'USDT',
			name: 'Platform USDT',
			address: '0xPlatformAddressUSDTExample123456789',
			isActive: true
		}
	]);
	console.log('✅ Platform wallets created');

	// 13. Create withdrawal request
	const userWallet = await db.select().from(wallets).where(eq(wallets.userId, user1.id)).limit(1);
	await db.insert(withdrawals).values({
		userId: user1.id,
		walletId: userWallet[0].id,
		walletType: 'main',
		amount: '500.00',
		cryptoSymbol: 'BTC',
		cryptoAmount: '0.012',
		status: 'pending'
	});
	console.log('✅ Withdrawal created');

	// 14. Create referral record
	await db.insert(referrals).values({
		referrerId: user1.id,
		referredId: user2.id,
		investmentId: investment2.id,
		bonusEarned: '200.00',
		referralLevel: 1,
		status: 'active'
	});
	console.log('✅ Referral created');

	// 15. Create user groups with correct thresholds
	await db.insert(userGroups).values([
		{ name: 'Pioneer', tokenThreshold: '0.00', description: 'Entry level members (< 500 tokens)' },
		{ name: 'Ambassador', tokenThreshold: '500.00', description: 'Active investors (500 - 1,999 tokens)' },
		{ name: 'Elite Partner', tokenThreshold: '2000.00', description: 'Premium members (2,000 - 9,999 tokens)' },
		{ name: 'Regional Leader', tokenThreshold: '10000.00', description: 'Top investors (>= 10,000 tokens)' }
	]);
	console.log('✅ User groups created');

	// 16. Create blog posts
	await db.insert(blogPosts).values([
		{
			title: 'Welcome to Ethercore',
			slug: 'welcome-to-ethercore',
			content:
				'<h1>Welcome to Ethercore</h1><p>We are excited to have you join our investment platform. Our mission is to provide secure, transparent, and profitable investment opportunities.</p><h2>Getting Started</h2><p>Start by exploring our investment plans and choosing the one that fits your goals.</p>',
			excerpt: 'Learn about our investment platform and get started today.',
			authorId: admin.id,
			status: 'published',
			publishedAt: new Date()
		},
		{
			title: 'Understanding Our Investment Plans',
			slug: 'understanding-investment-plans',
			content:
				'<h1>Understanding Our Investment Plans</h1><p>Our platform offers various investment plans tailored to different risk appetites and financial goals.</p><h2>Simple Returns</h2><p>We use simple (non-compounding) interest rates, paid out on your original capital at specified intervals.</p><h2>Capital Return</h2><p>At the end of your investment term, 90% of your principal capital is returned to your wallet.</p>',
			excerpt: 'A comprehensive guide to our investment plans.',
			authorId: admin.id,
			status: 'published',
			publishedAt: new Date()
		}
	]);
	console.log('✅ Blog posts created');

	// 17. Create site settings
	await db.insert(siteSettings).values([
		{ key: 'site_name', value: 'Ethercore' },
		{ key: 'site_email', value: 'hello@ethercore.org' },
		{ key: 'site_phone', value: '+1 (555) 000-0000' },
		{ key: 'site_address', value: '88 Brook Street, London, W1K 5AY' },
		{ key: 'token_symbol', value: 'INV' },
		{ key: 'token_multiplier', value: '0.8' },
		{ key: 'min_withdrawal', value: '50' },
		{ key: 'max_withdrawal', value: '100000' },
		{ key: 'referral_bonus', value: '10' }
	]);
	console.log('✅ Site settings created');

	// 18. Create AI settings
	await db.insert(aiSettings).values([
		{ key: 'groq_api_key', value: '' },
		{ key: 'model', value: 'mixtral-8x7b-32768' },
		{ key: 'enabled', value: 'false' }
	]);
	console.log('✅ AI settings created');

	console.log('🎉 Seed completed successfully!');
	console.log('\n📧 Admin credentials:');
	console.log('   Email: admin@ethercore.org');
	console.log('   Password: admin123');
	console.log('\n📧 Test user credentials:');
	console.log('   Email: john@example.com');
	console.log('   Password: password123');
	console.log('\n💰 Financial Rules:');
	console.log('   - ROI: Simple interest (non-compounding by default)');
	console.log('   - Capital Return: 90% at term end (10% management fee)');
	console.log('   - Compounding: 40% after 180 days (one time)');
	console.log('   - Tokens: 1 per $1 invested, convert at 0.8:1');
	console.log('   - Referrals: Level 1: 10%, Level 2: 10%');
}

// Generate historical data for sparkline charts and percentage calculations
export async function seedHistoricalData() {
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

	for (const user of allUsers) {
		// Get current stats for this user
		const userInvestments = await db.select().from(investments).where(eq(investments.userId, user.id));
		const userReferrals = await db.select().from(referrals).where(eq(referrals.referredId, user.id));

		// Calculate current values
		const currentTotalInvested = userInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
		const currentWalletBalance = Number(user.walletBalance);
		const currentTotalProfit = userInvestments.reduce((sum, inv) => sum + Number(inv.profitAccrued), 0);
		const currentReferralEarnings = userReferrals.reduce((sum, ref) => sum + Number(ref.bonusEarned), 0);

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
if (isMainModule || process.argv[1]?.endsWith('seed.ts')) {
	seed()
		.then(() => seedHistoricalData())
		.then(() => process.exit(0))
		.catch((error) => {
			console.error('❌ Seed failed:', error);
			process.exit(1);
		});
}
