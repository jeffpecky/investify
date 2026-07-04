import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, investments, withdrawals, plans } from '$lib/server/db/schema';
import { sql, eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Get stats
	const [totalUsersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
	const totalUsers = totalUsersResult?.count || 0;

	const [totalInvestmentsResult] = await db.select({ 
		sum: sql<string>`COALESCE(sum(amount), 0)::text` 
	}).from(investments);
	const totalInvestments = Number(totalInvestmentsResult?.sum || 0);

	const [activeInvestmentsResult] = await db.select({ count: sql<number>`count(*)::int` })
		.from(investments)
		.where(eq(investments.status, 'active'));
	const activeInvestments = activeInvestmentsResult?.count || 0;

	const [pendingWithdrawalsResult] = await db.select({ count: sql<number>`count(*)::int` })
		.from(withdrawals)
		.where(eq(withdrawals.status, 'pending'));
	const pendingWithdrawals = pendingWithdrawalsResult?.count || 0;

	const [pendingInvestmentsResult] = await db.select({ count: sql<number>`count(*)::int` })
		.from(investments)
		.where(eq(investments.status, 'pending'));
	const pendingInvestments = pendingInvestmentsResult?.count || 0;

	const [totalPlansResult] = await db.select({ count: sql<number>`count(*)::int` }).from(plans);
	const totalPlans = totalPlansResult?.count || 0;

	// Recent users (last 5)
	const recentUsers = await db
		.select({
			id: users.id,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			createdAt: users.createdAt,
			role: users.role
		})
		.from(users)
		.orderBy(desc(users.createdAt))
		.limit(5);

	// Recent investments (last 5)
	const recentInvestments = await db
		.select({
			id: investments.id,
			amount: investments.amount,
			status: investments.status,
			createdAt: investments.createdAt,
			user: {
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email
			},
			plan: {
				name: plans.name
			}
		})
		.from(investments)
		.leftJoin(users, eq(investments.userId, users.id))
		.leftJoin(plans, eq(investments.planId, plans.id))
		.orderBy(desc(investments.createdAt))
		.limit(5);

	return {
		breadcrumbs: [{ title: 'Dashboard', href: '/admin/dashboard' }],
		stats: {
			totalUsers,
			totalInvestments,
			activeInvestments,
			pendingWithdrawals,
			pendingInvestments,
			totalPlans
		},
		recentUsers,
		recentInvestments
	};
};
