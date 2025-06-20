ALTER TABLE "todo-agent_block" DROP CONSTRAINT "todo-agent_block_checkboxes_todo-agent_checkbox_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-agent_block" DROP CONSTRAINT "todo-agent_block_listItems_todo-agent_list_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-agent_block" DROP CONSTRAINT "todo-agent_block_headings_todo-agent_heading_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-agent_block" DROP CONSTRAINT "todo-agent_block_paragraphs_todo-agent_paragraph_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-agent_page" DROP CONSTRAINT "todo-agent_page_blocks_todo-agent_block_id_fk";
--> statement-breakpoint
ALTER TABLE "todo-agent_block" DROP COLUMN "checkboxes";--> statement-breakpoint
ALTER TABLE "todo-agent_block" DROP COLUMN "listItems";--> statement-breakpoint
ALTER TABLE "todo-agent_block" DROP COLUMN "headings";--> statement-breakpoint
ALTER TABLE "todo-agent_block" DROP COLUMN "paragraphs";--> statement-breakpoint
ALTER TABLE "todo-agent_page" DROP COLUMN "blocks";