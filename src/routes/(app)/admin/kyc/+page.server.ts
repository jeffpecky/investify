import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { kycDocuments, users } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { updateKycSchema } from '$lib/server/validation/admin';

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

export const actions: Actions = {
	approve: async ({ request }) => {
		const formData = await request.formData();
		const documentId = formData.get('documentId');
		const userId = formData.get('userId');
		
		try {
			// Update KYC document
			await db
				.update(kycDocuments)
				.set({
					status: 'approved',
					updatedAt: new Date()
				})
				.where(eq(kycDocuments.id, documentId as string));
			
			// Update user KYC status
			await db
				.update(users)
				.set({
					kycStatus: 'approved',
					updatedAt: new Date()
				})
				.where(eq(users.id, userId as string));
			
			return {
				success: true,
				message: 'KYC approved'
			};
		} catch (error) {
			return fail(500, {
				error: 'Failed to approve KYC'
			});
		}
	},
	
	reject: async ({ request }) => {
		const formData = await request.formData();
		const documentId = formData.get('documentId');
		const userId = formData.get('userId');
		const notes = formData.get('notes');
		
		try {
			await db
				.update(kycDocuments)
				.set({
					status: 'rejected',
					notes: notes?.toString(),
					updatedAt: new Date()
				})
				.where(eq(kycDocuments.id, documentId as string));
			
			await db
				.update(users)
				.set({
					kycStatus: 'rejected',
					updatedAt: new Date()
				})
				.where(eq(users.id, userId as string));
			
			return {
				success: true,
				message: 'KYC rejected'
			};
		} catch (error) {
			return fail(500, {
				error: 'Failed to reject KYC'
			});
		}
	}
};
