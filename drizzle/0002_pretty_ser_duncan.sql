ALTER TABLE "ateliers" ALTER COLUMN "title" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ateliers" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ateliers" ALTER COLUMN "description" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ateliers" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "creanaux" ALTER COLUMN "capacity" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "creanaux" ALTER COLUMN "capacity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "creanaux" ADD COLUMN "start_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "creanaux" ADD COLUMN "end_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "creanaux" ADD COLUMN "rrule" text;