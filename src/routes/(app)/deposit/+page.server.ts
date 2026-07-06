import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { platformWallets, deposits } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { safeQuery } from '$lib/server/db/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	// Fetch active platform wallet addresses from database
	const activePlatformWallets = await safeQuery(
		() =>
			db
				.select({
					cryptocurrency: platformWallets.cryptocurrency,
					address: platformWallets.address,
					name: platformWallets.name
				})
				.from(platformWallets)
				.where(eq(platformWallets.isActive, true)),
		'Failed to load platform wallets'
	);

	// Convert to object format for easy lookup
	const walletsMap: Record<string, string> = {};
	activePlatformWallets?.forEach((wallet) => {
		walletsMap[wallet.cryptocurrency] = wallet.address;
	});

	// Fetch user's pending/recent deposits
	const userDeposits = await safeQuery(
		() =>
			db
				.select({
					id: deposits.id,
					cryptocurrency: deposits.cryptocurrency,
					amount: deposits.amount,
					transactionHash: deposits.transactionHash,
					status: deposits.status,
					createdAt: deposits.createdAt,
					confirmedAt: deposits.confirmedAt
				})
				.from(deposits)
				.where(eq(deposits.userId, user.id))
				.orderBy(desc(deposits.createdAt))
				.limit(10),
		'Failed to load deposits'
	);

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/dashboard' },
			{ title: 'Deposit', href: '/deposit' }
		],
		platformWallets: walletsMap,
		pendingDeposits: userDeposits || [],
		user
	};
};

export const actions: Actions = {
	submitDeposit: async ({ request, locals }) => {
		const user = locals.user!;
		const formData = await request.formData();
		
		const cryptocurrency = formData.get('cryptocurrency') as string;
		const amount = Number(formData.get('amount'));
		const transactionHash = formData.get('transactionHash') as string;

		if (!cryptocurrency || !amount || !transactionHash) {
			return fail(400, {
				error: 'All fields are required'
			});
		}

		if (amount <= 0) {
			return fail(400, {
				error: 'Amount must be greater than 0'
			});
		}

		// Check if transaction hash already exists
		const existingDeposit = await db
			.select()
			.from(deposits)
			.where(eq(deposits.transactionHash, transactionHash))
			.limit(1);

		if (existingDeposit && existingDeposit.length > 0) {
			return fail(400, {
				error: 'This transaction hash has already been submitted'
			});
		}

		// Get the platform wallet ID for this cryptocurrency
		const [platformWallet] = await db
			.select()
			.from(platformWallets)
			.where(
				and(
					eq(platformWallets.cryptocurrency, cryptocurrency),
					eq(platformWallets.isActive, true)
				)
			)
			.limit(1);

		// Create deposit record with pending status
		await db.insert(deposits).values({
			userId: user.id,
			platformWalletId: platformWallet?.id || null,
			cryptocurrency,
			amount: amount.toString(),
			transactionHash,
			status: 'pending'
		});

		return {
			success: true,
			message: 'Deposit submitted successfully. Your funds will be credited after admin verification.'
		};
	}
};
