import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPlanSchema } from '$lib/server/validation/admin';
import { db } from '$lib/server/db';
import { plans } from '$lib/server/db/schema';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			name: formData.get('name'),
			category: formData.get('category'),
			minAmount: formData.get('minAmount'),
			maxAmount: formData.get('maxAmount'),
			durationDays: Number(formData.get('durationDays')),
			percentMin: formData.get('percentMin'),
			percentMax: formData.get('percentMax'),
			payoutOptions: JSON.parse(formData.get('payoutOptions') as string || '["daily"]'),
			features: JSON.parse(formData.get('features') as string || '[]'),
			status: formData.get('status') || 'active',
			recommended: formData.get('recommended') === 'true'
		};
		
		const result = createPlanSchema.safeParse(data);
		
		if (!result.success) {
			return fail(400, {
				errors: result.error.flatten().fieldErrors,
				data
			});
		}
		
		try {
			const [plan] = await db
				.insert(plans)
				.values({
					...result.data,
					referralLevels: []
				})
				.returning();
			
			throw redirect(303, `/admin/plans/${plan.id}/edit`);
		} catch (error) {
			if (error instanceof Response) throw error;
			return fail(500, {
				error: 'Failed to create plan',
				data
			});
		}
	}
};
