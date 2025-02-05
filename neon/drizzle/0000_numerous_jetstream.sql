-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "food" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredient" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_ingredient" (
	"food_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"quantity" varchar(50),
	CONSTRAINT "food_ingredient_pkey" PRIMARY KEY("food_id","ingredient_id")
);
--> statement-breakpoint
ALTER TABLE "food_ingredient" ADD CONSTRAINT "food_ingredient_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_ingredient" ADD CONSTRAINT "food_ingredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE no action ON UPDATE no action;
*/