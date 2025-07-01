import { relations } from "drizzle-orm/relations";
import { todoAgentBlock, todoAgentLink, todoAgentCheckbox, todoAgentPage, todoAgentHeading, todoAgentParagraph, todoAgentList } from "./schema";

export const todoAgentLinkRelations = relations(todoAgentLink, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentLink.blockId],
		references: [todoAgentBlock.id]
	}),
}));

export const todoAgentBlockRelations = relations(todoAgentBlock, ({one, many}) => ({
	todoAgentLinks: many(todoAgentLink),
	todoAgentCheckboxes: many(todoAgentCheckbox),
	todoAgentPage: one(todoAgentPage, {
		fields: [todoAgentBlock.pageId],
		references: [todoAgentPage.id]
	}),
	todoAgentHeadings: many(todoAgentHeading),
	todoAgentParagraphs: many(todoAgentParagraph),
	todoAgentLists: many(todoAgentList),
}));

export const todoAgentCheckboxRelations = relations(todoAgentCheckbox, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentCheckbox.blockId],
		references: [todoAgentBlock.id]
	}),
}));

export const todoAgentPageRelations = relations(todoAgentPage, ({many}) => ({
	todoAgentBlocks: many(todoAgentBlock),
}));

export const todoAgentHeadingRelations = relations(todoAgentHeading, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentHeading.blockId],
		references: [todoAgentBlock.id]
	}),
}));

export const todoAgentParagraphRelations = relations(todoAgentParagraph, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentParagraph.blockId],
		references: [todoAgentBlock.id]
	}),
}));

export const todoAgentListRelations = relations(todoAgentList, ({one}) => ({
	todoAgentBlock: one(todoAgentBlock, {
		fields: [todoAgentList.blockId],
		references: [todoAgentBlock.id]
	}),
}));