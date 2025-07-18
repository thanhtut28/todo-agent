CREATE TYPE "public"."block_item_variant" AS ENUM('heading', 'checkbox', 'paragraph', 'list', 'link');--> statement-breakpoint
CREATE TABLE "todo-agent_account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"scope" text,
	"password" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo-agent_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "todo-agent_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "todo-agent_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"hasOnboarded" boolean DEFAULT false NOT NULL,
	CONSTRAINT "todo-agent_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "todo-agent_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "todo-agent_page" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-agent_account" ADD CONSTRAINT "todo-agent_account_userId_todo-agent_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."todo-agent_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo-agent_session" ADD CONSTRAINT "todo-agent_session_userId_todo-agent_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."todo-agent_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo-agent_page" ADD CONSTRAINT "todo-agent_page_userId_todo-agent_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."todo-agent_user"("id") ON DELETE cascade ON UPDATE cascade;