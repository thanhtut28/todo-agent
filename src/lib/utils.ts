import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  BlockWithContent,
  Heading as HeadingType,
  Checkbox as CheckboxType,
  Paragraph as ParagraphType,
  ListItem as ListItemType,
  Link as LinkType,
} from "~/server/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BlockItemType =
  | HeadingType
  | CheckboxType
  | ParagraphType
  | ListItemType
  | LinkType;

export type BlockItemVariant =
  | "heading"
  | "checkbox"
  | "paragraph"
  | "list"
  | "link";

export function flattenBlockItems(block: BlockWithContent) {
  const _blockItems: { variant: BlockItemVariant; item: BlockItemType }[] = [];

  block.headings.forEach((heading) => {
    _blockItems.push({ variant: "heading", item: heading });
  });

  block.checkboxes.forEach((checkbox) => {
    _blockItems.push({ variant: "checkbox", item: checkbox });
  });

  block.paragraphs.forEach((paragraph) => {
    _blockItems.push({ variant: "paragraph", item: paragraph });
  });

  block.listItems.forEach((listItem) => {
    _blockItems.push({ variant: "list", item: listItem });
  });

  block.links.forEach((link) => {
    _blockItems.push({ variant: "link", item: link });
  });

  _blockItems.sort((a, b) => a.item.displayOrder - b.item.displayOrder);

  return _blockItems;
}
