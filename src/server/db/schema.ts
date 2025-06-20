// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { Relation, relations, sql, type InferSelectModel } from "drizzle-orm";
import { index, pgTableCreator, pgEnum, PgTable } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `todo-agent_${name}`);

export const headingVariant = pgEnum("heading_variant", [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);
export const fontSize = pgEnum("font_size", [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
]);
const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "white",
  "black",
  "gray",
  "purple",
  "pink",
  "brown",
  "cyan",
  "teal",
  "transparent",
] as const;
export const color = pgEnum("color", colors);
export const bgColor = pgEnum("bg_color", colors);

export const fontWeight = pgEnum("font_weight", [
  "thin",
  "extralight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
]);

export const fontStyle = pgEnum("font_style", ["normal", "italic", "oblique"]);

export const listType = pgEnum("list_type", [
  "ordered",
  "unordered",
  "numbered",
]);

export const checkboxes = createTable(
  "checkbox",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    text: d.text().notNull(),
    checked: d.boolean().default(false).notNull(),
    blockId: d
      .integer()
      .notNull()
      .references(() => blocks.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    fontSize: fontSize().default("md").notNull(),
    fontWeight: fontWeight().default("normal").notNull(),
    color: color().default("black").notNull(),
    bgColor: bgColor().default("transparent").notNull(),
    fontStyle: fontStyle().default("normal").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("checkbox_text_idx").on(t.text)],
);

export const listItems = createTable(
  "list",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    text: d.text().notNull(),
    blockId: d
      .integer()
      .notNull()
      .references(() => blocks.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    fontSize: fontSize().default("md").notNull(),
    fontWeight: fontWeight().default("normal").notNull(),
    color: color().default("black").notNull(),
    bgColor: bgColor().default("transparent").notNull(),
    fontStyle: fontStyle().default("normal").notNull(),
    listType: listType().default("unordered").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("list_text_idx").on(t.text)],
);

export const headings = createTable(
  "heading",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    text: d.text().notNull(),
    variant: headingVariant().default("h1").notNull(),
    blockId: d
      .integer()
      .notNull()
      .references(() => blocks.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    fontSize: fontSize().default("2xl").notNull(),
    fontWeight: fontWeight().default("bold").notNull(),
    color: color().default("black").notNull(),
    bgColor: bgColor().default("transparent").notNull(),
    fontStyle: fontStyle().default("normal").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("heading_text_idx").on(t.text)],
);

export const paragraphs = createTable(
  "paragraph",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    text: d.text().notNull(),
    blockId: d
      .integer()
      .notNull()
      .references(() => blocks.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    fontSize: fontSize().default("md").notNull(),
    fontWeight: fontWeight().default("normal").notNull(),
    color: color().default("black").notNull(),
    bgColor: bgColor().default("transparent").notNull(),
    fontStyle: fontStyle().default("normal").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("paragraph_text_idx").on(t.text)],
);

export const links = createTable(
  "link",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    text: d.text().notNull(),
    url: d.text().notNull(),
    blockId: d
      .integer()
      .notNull()
      .references(() => blocks.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    fontSize: fontSize().default("md").notNull(),
    fontWeight: fontWeight().default("medium").notNull(),
    color: color().default("blue").notNull(),
    bgColor: bgColor().default("transparent").notNull(),
    fontStyle: fontStyle().default("italic").notNull(),
    underline: d.boolean().default(true).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("link_text_idx").on(t.text)],
);

export const blocks = createTable(
  "block",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    text: d.text().notNull(),
    pageId: d
      .integer()
      .notNull()
      .references(() => pages.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("block_text_idx").on(t.text)],
);

export const pages = createTable(
  "page",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.text().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("page_name_idx").on(t.name)],
);

export const checkboxesRelations = relations(checkboxes, ({ one }) => ({
  block: one(blocks, {
    fields: [checkboxes.blockId],
    references: [blocks.id],
  }),
}));

export const listItemsRelations = relations(listItems, ({ one }) => ({
  block: one(blocks, {
    fields: [listItems.blockId],
    references: [blocks.id],
  }),
}));

export const headingsRelations = relations(headings, ({ one }) => ({
  block: one(blocks, {
    fields: [headings.blockId],
    references: [blocks.id],
  }),
}));

export const paragraphsRelations = relations(paragraphs, ({ one }) => ({
  block: one(blocks, {
    fields: [paragraphs.blockId],
    references: [blocks.id],
  }),
}));

export const linkRelations = relations(links, ({ one }) => ({
  block: one(blocks, {
    fields: [links.blockId],
    references: [blocks.id],
  }),
}));

export const blockRelations = relations(blocks, ({ many, one }) => ({
  checkboxes: many(checkboxes),
  listItems: many(listItems),
  headings: many(headings),
  paragraphs: many(paragraphs),
  links: many(links),
  page: one(pages, {
    fields: [blocks.pageId],
    references: [pages.id],
  }),
}));

export const pageRelations = relations(pages, ({ many }) => ({
  blocks: many(blocks),
}));

// Base types without relations to avoid circular dependencies
export type Paragraph = InferSelectModel<typeof paragraphs>;
export type Heading = InferSelectModel<typeof headings>;
export type ListItem = InferSelectModel<typeof listItems>;
export type Checkbox = InferSelectModel<typeof checkboxes>;
export type Link = InferSelectModel<typeof links>;
export type Block = InferSelectModel<typeof blocks>;
export type Page = InferSelectModel<typeof pages>;

// Extended types with relations
export type ParagraphWithBlock = Paragraph & {
  block: Block;
};
export type HeadingWithBlock = Heading & {
  block: Block;
};
export type ListItemWithBlock = ListItem & {
  block: Block;
};
export type CheckboxWithBlock = Checkbox & {
  block: Block;
};
export type LinkWithBlock = Link & {
  block: Block;
};
export type BlockWithContent = Block & {
  checkboxes: Checkbox[];
  listItems: ListItem[];
  headings: Heading[];
  paragraphs: Paragraph[];
  links: Link[];
  page: Page;
};
export type PageWithBlocks = Page & {
  blocks: Block[];
};
export type PageWithFullContent = Page & {
  blocks: BlockWithContent[];
};
