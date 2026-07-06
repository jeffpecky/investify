import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { forgotPasswordSchema } from '$lib/server/validation/auth';
import { createPasswordResetToken, sendPasswordResetEmail } from '$lib/server/services/email';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		throw redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');

		const result = forgotPasswordSchema.safeParse({ email });
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, {
				errors: {
					email: errors.email?.[0] || null
				},
				data: { email: String(email || '') }
			});
		}

		const [user] = await db.select().from(users).where(eq(users.email, result.data.email));

		if (user) {
			const token = await createPasswordResetToken(user.id);
			await sendPasswordResetEmail(user.email, token);
		}

		return { success: true };
	}
};
