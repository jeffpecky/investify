import { z } from 'zod';

// User management
export const updateUserSchema = z.object({
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	email: z.string().email().optional(),
	role: z.enum(['user', 'admin', 'company']).optional(),
	kycStatus: z.enum(['pending', 'submitted', 'approved', 'rejected']).optional(),
	walletBalance: z.string().optional(),
	tokenBalance: z.string().optional()
});

// Plan management
export const createPlanSchema = z.object({
	name: z.string().min(1, 'Plan name is required'),
	category: z.string().min(1, 'Category is required'),
	minAmount: z.string().min(1, 'Minimum amount is required'),
	maxAmount: z.string().min(1, 'Maximum amount is required'),
	durationDays: z.number().int().positive(),
	percentMin: z.string().min(1),
	percentMax: z.string().min(1),
	payoutOptions: z.array(z.string()).min(1),
	features: z.array(z.string()).optional(),
	status: z.enum(['active', 'inactive']).default('active'),
	recommended: z.boolean().default(false)
});

export const updatePlanSchema = createPlanSchema.partial();

// Investment management
export const updateInvestmentStatusSchema = z.object({
	status: z.enum(['pending', 'active', 'completed', 'rejected']),
	notes: z.string().optional()
});

// Withdrawal management
export const updateWithdrawalSchema = z.object({
	status: z.enum(['pending', 'processing', 'completed', 'rejected']),
	transactionHash: z.string().optional(),
	notes: z.string().optional()
});

// KYC management
export const updateKycSchema = z.object({
	status: z.enum(['pending', 'approved', 'rejected']),
	notes: z.string().optional()
});

// Blog post
export const createBlogPostSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	content: z.string().min(1, 'Content is required'),
	excerpt: z.string().optional(),
	coverImage: z.string().url().optional(),
	status: z.enum(['draft', 'published']).default('draft')
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

// Settings
export const updateWebsiteSettingsSchema = z.object({
	siteName: z.string().min(1).optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	address: z.string().optional()
});

export const updatePlatformSettingsSchema = z.object({
	tokenMultiplier: z.string().optional(),
	compoundingThreshold: z.string().optional(),
	referralBonus: z.string().optional()
});
