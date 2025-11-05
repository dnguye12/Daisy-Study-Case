CREATE TABLE "creneaux_exdates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creneau_id" uuid NOT NULL,
	"exdate" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "creneaux_exdates" ADD CONSTRAINT "creneaux_exdates_creneau_id_creanaux_id_fk" FOREIGN KEY ("creneau_id") REFERENCES "public"."creanaux"("id") ON DELETE cascade ON UPDATE no action;