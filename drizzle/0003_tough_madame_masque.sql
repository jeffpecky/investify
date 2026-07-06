ALTER TABLE "payouts" ALTER COLUMN "capital_growth" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "payout_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "roi_percent" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "investments" ADD COLUMN "last_calculation_date" timestamp;--> statement-breakpoint
ALTER TABLE "investments" ADD COLUMN "last_payout_date" timestamp;--> statement-breakpoint
ALTER TABLE "investments" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "amount" numeric(18, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "type" varchar(20) DEFAULT 'interest' NOT NULL;--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "requested_at" timestamp;--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "processed_at" timestamp;