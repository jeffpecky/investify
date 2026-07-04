import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { desc, like, or, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 20;
	const offset = (page - 1) * limit;
	const search = url.searchParams.get('search') || '';

	// Build query
	let query = db.select().from(users);

	if (search) {
		query = query.where(
			or(
				like(users.email, `%${search}%`),
				like(users.firstName, `%${search}%`),
				like(users.lastName, `%${search}%`)
			)
		) as any;
	}

	const usersList = await query
		.orderBy(desc(users.createdAt))
		.limit(limit)
		.offset(offset);

	// Get total count
	const [totalResult] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(users);
	const total = totalResult?.count || 0;

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Users', href: '/admin/users' }
		],
		users: usersList,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		},
		search
	};
};
