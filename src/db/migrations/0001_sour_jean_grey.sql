CREATE TABLE "tarot_cards" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tarot_cards_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"card_name" varchar(255) NOT NULL,
	"deck_type" varchar(50) NOT NULL,
	"card_number" integer,
	"suit" varchar(50),
	"arcana_type" varchar(50),
	"upright_meaning" text,
	"reversed_meaning" text,
	"keywords" text,
	"image_url" varchar(255),
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tarot_readings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tarot_readings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" varchar(255) NOT NULL,
	"user_uuid" varchar(255) NOT NULL,
	"deck_type" varchar(50) NOT NULL,
	"spread_type" varchar(50) NOT NULL,
	"question" text,
	"cards_drawn" text,
	"interpretation" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "tarot_readings_uuid_unique" UNIQUE("uuid")
);
