import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { kycDocuments, users } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const kycList = await db
		.select({
			id: kycDocuments.id,
			documentType: kycDocuments.documentType,
			filePath: kycDocuments.filePath,
			status: kycDocuments.status,
			notes: kycDocuments.notes,
			createdAt: kycDocuments.createdAt,
			updatedAt: kycDocuments.updatedAt,
			user: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email,
				kycStatus: users.kycStatus
			}
		})
		.from(kycDocuments)
		.leftJoin(users, eq(kycDocuments.userId, users.id))
		.orderBy(desc(kycDocuments.createdAt))
		.limit(50);

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'KYC Verification', href: '/admin/kyc' }
		],
		kycDocuments: kycList
	};
};
