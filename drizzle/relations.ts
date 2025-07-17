import { relations } from "drizzle-orm/relations";
import { todoAgentBlock, todoAgentLink, todoAgentHeading, todoAgentCheckbox, todoAgentParagraph, todoAgentPage, todoAgentList } from "./schema";

export const todoAgentLinkRelations = relations(todoAgentLink, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentLink.blockId],
		references: [todoAgentBlock.id]
	}),
}));

export const todoAgentBlockRelations = relations(todoAgentBlock, ({one, many}) => ({
	todoAgentLinks: many(todoAgentLink),
	todoAgentHeadings: many(todoAgentHeading),
	todoAgentCheckboxes: many(todoAgentCheckbox),
	todoAgentParagraphs: many(todoAgentParagraph),
	todoAgentPage: one(todoAgentPage, {
		fields: [todoAgentBlock.pageId],
		references: [todoAgentPage.id]
	}),
	todoAgentLists: many(todoAgentList),
}));

export const todoAgentHeadingRelations = relations(todoAgentHeading, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentHeading.blockId],
		references: [todoAgentBlock.id]
	}),
}));

export const todoAgentCheckboxRelations = relations(todoAgentCheckbox, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentCheckbox.blockId],
		references: [todoAgentBlock.id]
	}),
}));

export const todoAgentParagraphRelations = relations(todoAgentParagraph, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentParagraph.blockId],
		references: [todoAgentBlock.id]
	}),
}));

export const todoAgentPageRelations = relations(todoAgentPage, ({many}) => ({
	todoAgentBlocks: many(todoAgentBlock),
}));

export const todoAgentListRelations = relations(todoAgentList, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentList.blockId],
		references: [todoAgentBlock.id]
	}),
}));