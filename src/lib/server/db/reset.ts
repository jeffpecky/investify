import { db } from './index';
import { sql } from 'drizzle-orm';

async function reset() {
	console.log('🗑️  Resetting database...');
	
	try {
		// Truncate all tables in the correct order (respecting foreign keys)
		await db.execute(sql`TRUNCATE TABLE 
			payouts,
			withdrawals,
			deposits,
			referrals,
			investments,
			wallets,
			sessions,
			password_reset_tokens,
			email_verification_tokens,
			kyc_documents,
			notifications,
			survey_responses,
			survey_questions,
			surveys,
			blog_posts,
			contact_submissions,
			audit_logs,
			users,
			plans,
			plan_categories,
			plan_features,
			payout_options,
			platform_wallets,
			user_groups,
			site_settings,
			ai_settings,
			holidays
			RESTART IDENTITY CASCADE
		`);
		
		console.log('✅ Database reset complete');
	} catch (error) {
		console.error('❌ Reset failed:', error);
		throw error;
	}
}

reset()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
