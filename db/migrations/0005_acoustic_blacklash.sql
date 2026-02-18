ALTER TABLE "projects" ALTER COLUMN "revenue" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "revenue" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "expenses" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "expenses" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "profit" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "profit" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "margin" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "margin" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "hourly_rate" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "hourly_rate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "hours_worked" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "hours_worked" DROP NOT NULL;