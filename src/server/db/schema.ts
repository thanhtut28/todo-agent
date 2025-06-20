// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql, type InferSelectModel } from "drizzle-orm";
import { index, pgTableCreator, pgEnum } from "drizzle-orm/pg-core";

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

export const link = createTable(
  "link",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    text: d.text().notNull(),
    url: d.text().notNull(),
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

export const block = createTable(
  "block",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    text: d.text().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    checkboxes: d.integer().references(() => checkboxes.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    listItems: d.integer().references(() => listItems.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    headings: d.integer().references(() => headings.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    paragraphs: d.integer().references(() => paragraphs.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  }),
  (t) => [index("block_text_idx").on(t.text)],
);

export const pages = createTable(
  "page",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.text().notNull(),
    blocks: d.integer().references(() => block.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("page_name_idx").on(t.name)],
);

export type Paragraph = InferSelectModel<typeof paragraphs>;
export type Heading = InferSelectModel<typeof headings>;
export type ListItem = InferSelectModel<typeof listItems>;
export type Checkbox = InferSelectModel<typeof checkboxes>;
export type Link = InferSelectModel<typeof link>;
export type Block = InferSelectModel<typeof block>;
export type Page = InferSelectModel<typeof pages>;
