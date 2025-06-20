ALTER TABLE "todo-agent_block" ADD COLUMN "pageId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-agent_checkbox" ADD COLUMN "blockId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-agent_heading" ADD COLUMN "blockId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-agent_link" ADD COLUMN "blockId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-agent_list" ADD COLUMN "blockId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-agent_paragraph" ADD COLUMN "blockId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "todo-agent_block" ADD CONSTRAINT "todo-agent_block_pageId_todo-agent_page_id_fk" FOREIGN KEY ("pageId") REFERENCES "public"."todo-agent_page"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "todo-agent_checkbox" ADD CONSTRAINT "todo-agent_checkbox_blockId_todo-agent_block_id_fk" FOREIGN KEY ("blockId") REFERENCES "public"."todo-agent_block"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "todo-agent_heading" ADD CONSTRAINT "todo-agent_heading_blockId_todo-agent_block_id_fk" FOREIGN KEY ("blockId") REFERENCES "public"."todo-agent_block"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "todo-agent_link" ADD CONSTRAINT "todo-agent_link_blockId_todo-agent_block_id_fk" FOREIGN KEY ("blockId") REFERENCES "public"."todo-agent_block"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "todo-agent_list" ADD CONSTRAINT "todo-agent_list_blockId_todo-agent_block_id_fk" FOREIGN KEY ("blockId") REFERENCES "public"."todo-agent_block"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "todo-agent_paragraph" ADD CONSTRAINT "todo-agent_paragraph_blockId_todo-agent_block_id_fk" FOREIGN KEY ("blockId") REFERENCES "public"."todo-agent_block"("id") ON DELETE cascade ON UPDATE cascade;