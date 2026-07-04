import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { plans } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { updatePlanSchema } from '$lib/server/validation/admin';

export const load: PageServerLoad = async ({ params }) => {
	const planId = params.id;

	const [plan] = await db.select().from(plans).where(eq(plans.id, planId));

	if (!plan) {
		throw error(404, 'Plan not found');
	}

	return {
		breadcrumbs: [
			{ title: 'Dashboard', href: '/admin/dashboard' },
			{ title: 'Plans', href: '/admin/plans' },
			{ title: 'Edit Plan', href: `/admin/plans/${planId}/edit` }
		],
		plan
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const data = {
			name: formData.get('name'),
			category: formData.get('category'),
			minAmount: formData.get('minAmount'),
			maxAmount: formData.get('maxAmount'),
			durationDays: Number(formData.get('durationDays')),
			percentMin: formData.get('percentMin'),
			percentMax: formData.get('percentMax'),
			payoutOptions: JSON.parse(formData.get('payoutOptions') as string || '[]'),
			features: JSON.parse(formData.get('features') as string || '[]'),
			status: formData.get('status'),
			recommended: formData.get('recommended') === 'true'
		};
		
		const result = updatePlanSchema.safeParse(data);
		
		if (!result.success) {
			return fail(400, {
				errors: result.error.flatten().fieldErrors,
				data
			});
		}
		
		try {
			await db
				.update(plans)
				.set({
					...result.data,
					updatedAt: new Date()
				})
				.where(eq(plans.id, params.id));
			
			return {
				success: true,
				message: 'Plan updated successfully'
			};
		} catch (error) {
			return fail(500, {
				error: 'Failed to update plan',
				data
			});
		}
	},
	
	delete: async ({ params }) => {
		try {
			await db
				.delete(plans)
				.where(eq(plans.id, params.id));
			
			throw redirect(303, '/admin/plans');
		} catch (error) {
			if (error instanceof Response) throw error;
			return fail(500, {
				error: 'Failed to delete plan'
			});
		}
	}
};
