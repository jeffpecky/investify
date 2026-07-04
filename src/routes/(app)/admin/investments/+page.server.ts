import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { investments, users, plans } from '$lib/server/db/schema';
import { desc, eq, like, or, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 20;
	const offset = (page - 1) * limit;
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';

	// Build query
	let query = db
		.select({
			id: investments.id,
			amount: investments.amount,
			status: investments.status,
			paymentMethod: investments.paymentMethod,
			payoutOption: investments.payoutOption,
			profitAccrued: investments.profitAccrued,
			totalExpectedProfit: investments.totalExpectedProfit,
			startDate: investments.startDate,
			endDate: investments.endDate,
			createdAt: investments.createdAt,
			user: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email
			},
			plan: {
				id: plans.id,
				name: plans.name,
				category: plans.category
			}
		})
		.from(investments)
		.leftJoin(users, eq(investments.userId, users.id))
		.leftJoin(plans, eq(investments.planId, plans.id));

	const conditions = [];

	if (search) {
		conditions.push(
			or(
				like(users.email, `%${search}%`),
				like(users.firstName, `%${search}%`),
				like(users.lastName, `%${search}%`)
			)
		);
	}

	if (status) {
		conditions.push(eq(investments.status, status));
	}

	if (conditions.length > 0) {
		query = query.where(conditions.length === 1 ? conditions[0] : sql`${conditions.join(' AND ')}`) as any;
	}

	const investmentsList = await query
		.orderBy(desc(investments.createdAt))
		.limit(limit)
		.offset(offset);

	// Get total count
	const [totalResult] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(investments);
	const total = totalResult?.count || 0;

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Investments', href: '/admin/investments' }
		],
		investments: investmentsList,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		},
		search,
		status
	};
};
