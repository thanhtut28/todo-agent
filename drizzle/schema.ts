import { pgTable, index, foreignKey, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const bgColor = pgEnum("bg_color", ['red', 'orange', 'yellow', 'green', 'blue', 'white', 'black', 'gray', 'purple', 'pink', 'brown', 'cyan', 'teal', 'transparent'])
export const color = pgEnum("color", ['red', 'orange', 'yellow', 'green', 'blue', 'white', 'black', 'gray', 'purple', 'pink', 'brown', 'cyan', 'teal', 'transparent'])
export const fontSize = pgEnum("font_size", ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'])
export const fontStyle = pgEnum("font_style", ['normal', 'italic', 'oblique'])
export const fontWeight = pgEnum("font_weight", ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold'])
export const headingVariant = pgEnum("heading_variant", ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
export const listType = pgEnum("list_type", ['ordered', 'unordered', 'numbered'])


export const todoAgentLink = pgTable("todo-agent_link", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: ""todo-agent_link_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	text: text().notNull(),
	url: text().notNull(),
	fontSize: fontSize().default('md').notNull(),
	fontWeight: fontWeight().default('medium').notNull(),
	color: color().default('blue').notNull(),
	bgColor: bgColor().default('transparent').notNull(),
	fontStyle: fontStyle().default('italic').notNull(),
	underline: boolean().default(true).notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	blockId: integer().notNull(),
}, (table) => [
	index("link_text_idx").using("btree", table.text.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.blockId],
			foreignColumns: [todoAgentBlock.id],
			name: "todo-agent_link_blockId_todo-agent_block_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const todoAgentCheckbox = pgTable("todo-agent_checkbox", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: ""todo-agent_checkbox_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	text: text().notNull(),
	checked: boolean().default(false).notNull(),
	fontSize: fontSize().default('md').notNull(),
	fontWeight: fontWeight().default('normal').notNull(),
	color: color().default('black').notNull(),
	bgColor: bgColor().default('transparent').notNull(),
	fontStyle: fontStyle().default('normal').notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	blockId: integer().notNull(),
}, (table) => [
	index("checkbox_text_idx").using("btree", table.text.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.blockId],
			foreignColumns: [todoAgentBlock.id],
			name: "todo-agent_checkbox_blockId_todo-agent_block_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const todoAgentPage = pgTable("todo-agent_page", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: ""todo-agent_page_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: text().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	index("page_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const todoAgentBlock = pgTable("todo-agent_block", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: ""todo-agent_block_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	text: text().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	pageId: integer().notNull(),
}, (table) => [
	index("block_text_idx").using("btree", table.text.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.pageId],
			foreignColumns: [todoAgentPage.id],
			name: "todo-agent_block_pageId_todo-agent_page_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const todoAgentHeading = pgTable("todo-agent_heading", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: ""todo-agent_heading_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	text: text().notNull(),
	variant: headingVariant().default('h1').notNull(),
	fontSize: fontSize().default('2xl').notNull(),
	fontWeight: fontWeight().default('bold').notNull(),
	color: color().default('black').notNull(),
	bgColor: bgColor().default('transparent').notNull(),
	fontStyle: fontStyle().default('normal').notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	blockId: integer().notNull(),
}, (table) => [
	index("heading_text_idx").using("btree", table.text.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.blockId],
			foreignColumns: [todoAgentBlock.id],
			name: "todo-agent_heading_blockId_todo-agent_block_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const todoAgentParagraph = pgTable("todo-agent_paragraph", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: ""todo-agent_paragraph_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	text: text().notNull(),
	fontSize: fontSize().default('md').notNull(),
	fontWeight: fontWeight().default('normal').notNull(),
	color: color().default('black').notNull(),
	bgColor: bgColor().default('transparent').notNull(),
	fontStyle: fontStyle().default('normal').notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	blockId: integer().notNull(),
}, (table) => [
	index("paragraph_text_idx").using("btree", table.text.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.blockId],
			foreignColumns: [todoAgentBlock.id],
			name: "todo-agent_paragraph_blockId_todo-agent_block_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const todoAgentList = pgTable("todo-agent_list", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: ""todo-agent_list_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	text: text().notNull(),
	fontSize: fontSize().default('md').notNull(),
	fontWeight: fontWeight().default('normal').notNull(),
	color: color().default('black').notNull(),
	bgColor: bgColor().default('transparent').notNull(),
	fontStyle: fontStyle().default('normal').notNull(),
	listType: listType().default('unordered').notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
	blockId: integer().notNull(),
}, (table) => [
	index("list_text_idx").using("btree", table.text.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.blockId],
			foreignColumns: [todoAgentBlock.id],
			name: "todo-agent_list_blockId_todo-agent_block_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);
