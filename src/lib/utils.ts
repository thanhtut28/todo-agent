import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  blockItem,
  type BlockGenerationOutput,
  type BlockItem,
} from "~/server/agent/tool";
import type {
  BlockWithContent,
  Checkbox,
  Heading,
  Link,
  ListItem,
  Paragraph,
} from "~/server/db/schema";
import type { BlockItemType, BlockItemVariantType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FlattenBlockItem = {
  variant: BlockItemVariantType;
  item: BlockItemType;
};

export function flattenBlockItems(block: BlockWithContent) {
  const _blockItems: FlattenBlockItem[] = [];

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

export function covertFlattenBlockItemsToBlockWithContent(
  items: FlattenBlockItem[],
  block: BlockWithContent,
) {
  const headings = items
    .filter((item) => item.variant === "heading")
    .map((item) => item.item as Heading);
  const checkboxes = items
    .filter((item) => item.variant === "checkbox")
    .map((item) => item.item as Checkbox);
  const paragraphs = items
    .filter((item) => item.variant === "paragraph")
    .map((item) => item.item as Paragraph);
  const listItems = items
    .filter((item) => item.variant === "list")
    .map((item) => item.item as ListItem);
  const links = items
    .filter((item) => item.variant === "link")
    .map((item) => item.item as Link);

  return {
    ...block,
    checkboxes,
    headings,
    paragraphs,
    listItems,
    links,
  };
}

export function covertAIGeneratedContentToBlockWithContent(
  aiContent: BlockGenerationOutput,
  pageId: string,
  lastBlockDisplayOrder: number,
): BlockWithContent {
  const _draftBlock: BlockWithContent = {
    id: 0,
    text: aiContent.pageName,
    createdAt: new Date(),
    updatedAt: null,
    pageId: parseInt(pageId),
    checkboxes: [],
    headings: [],
    paragraphs: [],
    listItems: [],
    links: [],
    page: {
      id: 0,
      name: "",
      createdAt: new Date(),
      updatedAt: null,
      userId: "",
    },
    displayOrder: lastBlockDisplayOrder + 1,
  };

  aiContent.blocks.forEach((aiBlock, index) => {
    switch (aiBlock.type) {
      case "heading":
        _draftBlock.headings.push({
          id: index,
          blockId: _draftBlock.id,
          text: aiBlock.content.text,
          variant: aiBlock.content.variant ?? "h2",
          fontSize: aiBlock.content.fontSize ?? "2xl",
          fontWeight: aiBlock.content.fontWeight ?? "bold",
          color: aiBlock.content.color ?? "white",
          bgColor: aiBlock.content.bgColor ?? "transparent",
          fontStyle: aiBlock.content.fontStyle ?? "normal",
          createdAt: new Date(),
          updatedAt: null,
          displayOrder: index,
        });
        break;

      case "paragraph":
        _draftBlock.paragraphs.push({
          id: index,
          blockId: _draftBlock.id,
          text: aiBlock.content.text,
          fontSize: aiBlock.content.fontSize ?? "md",
          fontWeight: aiBlock.content.fontWeight ?? "bold",
          color: aiBlock.content.color ?? "white",
          bgColor: aiBlock.content.bgColor ?? "transparent",
          fontStyle: aiBlock.content.fontStyle ?? "normal",
          createdAt: new Date(),
          updatedAt: null,
          displayOrder: index,
        });
        break;

      case "checkbox":
        _draftBlock.checkboxes.push({
          id: index,
          blockId: _draftBlock.id,
          text: aiBlock.content.text,
          checked: aiBlock.content.checked ?? false,
          fontSize: aiBlock.content.fontSize ?? "md",
          fontWeight: aiBlock.content.fontWeight ?? "bold",
          color: aiBlock.content.color ?? "white",
          bgColor: aiBlock.content.bgColor ?? "transparent",
          fontStyle: aiBlock.content.fontStyle ?? "normal",
          createdAt: new Date(),
          updatedAt: null,
          displayOrder: index,
        });
        break;

      case "list":
        _draftBlock.listItems.push({
          id: index,
          blockId: _draftBlock.id,
          text: aiBlock.content.text,
          listType: aiBlock.content.listType ?? "unordered",
          fontSize: aiBlock.content.fontSize ?? "md",
          fontWeight: aiBlock.content.fontWeight ?? "bold",
          color: aiBlock.content.color ?? "white",
          bgColor: aiBlock.content.bgColor ?? "transparent",
          fontStyle: aiBlock.content.fontStyle ?? "normal",
          createdAt: new Date(),
          updatedAt: null,
          displayOrder: index,
        });
        break;

      case "link":
        _draftBlock.links.push({
          id: index,
          blockId: _draftBlock.id,
          text: aiBlock.content.text,
          underline: true,
          url: aiBlock.content.url ?? "#",
          fontSize: aiBlock.content.fontSize ?? "md",
          fontWeight: aiBlock.content.fontWeight ?? "bold",
          color: aiBlock.content.color ?? "white",
          bgColor: aiBlock.content.bgColor ?? "transparent",
          fontStyle: aiBlock.content.fontStyle ?? "normal",
          createdAt: new Date(),
          updatedAt: null,
          displayOrder: index,
        });
    }
  });
  return _draftBlock;
}

export function createDraftBlock(
  pageName: string,
  pageId: string,
  lastBlockDisplayOrder: number,
) {
  const _draftBlock: BlockWithContent = {
    id: 0,
    text: pageName,
    createdAt: new Date(),
    updatedAt: null,
    pageId: parseInt(pageId),
    checkboxes: [],
    headings: [],
    paragraphs: [],
    listItems: [],
    links: [],
    page: {
      id: 0,
      name: "",
      createdAt: new Date(),
      updatedAt: null,
      userId: "",
    },
    displayOrder: lastBlockDisplayOrder + 1,
  };

  return _draftBlock;
}

export function sliceParenthesisObject(text: string): string | null {
  const openBracketIndex = text.indexOf("{");
  const closeBracketIndex = text.lastIndexOf("}");

  if (openBracketIndex === -1 || closeBracketIndex === -1) {
    return null;
  }

  const slicedText = text.slice(openBracketIndex, closeBracketIndex + 1);

  return slicedText;
}

export function sliceUnbalancedTextFromStream(
  text: string,
  lastSlicedIndex: number | null,
) {
  const jsonStartIndex = lastSlicedIndex ?? text.indexOf("[");

  const slicedText = text.slice(jsonStartIndex + 1);

  return slicedText;
}

export function convertSlicedTextIntoBlockItem(text: string): BlockItem | null {
  try {
    const slicedText = sliceParenthesisObject(text);
    if (slicedText) {
      const parsed = blockItem.parse(JSON.parse(slicedText));
      return parsed;
    }

    return null;
  } catch (e) {
    return null;
  }
}

// This function is used to convert the date format for the draft block which is generated by the agent.
// The date format is in the format of "2025-07-06T00:00:00.000Z" which is not allowed by the database.
export function convertDateFormatForBlock(draftBlock: BlockWithContent) {
  const headings = draftBlock.headings.map((heading) => {
    return {
      ...heading,
      createdAt: new Date(heading.createdAt),
      updatedAt: heading.updatedAt ? new Date(heading.updatedAt) : null,
    };
  });

  const checkboxes = draftBlock.checkboxes.map((checkbox) => {
    return {
      ...checkbox,
      createdAt: new Date(checkbox.createdAt),
      updatedAt: checkbox.updatedAt ? new Date(checkbox.updatedAt) : null,
    };
  });

  const paragraphs = draftBlock.paragraphs.map((paragraph) => {
    return {
      ...paragraph,
      createdAt: new Date(paragraph.createdAt),
      updatedAt: paragraph.updatedAt ? new Date(paragraph.updatedAt) : null,
    };
  });

  const listItems = draftBlock.listItems.map((listItem) => {
    return {
      ...listItem,
      createdAt: new Date(listItem.createdAt),
      updatedAt: listItem.updatedAt ? new Date(listItem.updatedAt) : null,
    };
  });

  const links = draftBlock.links.map((link) => {
    return {
      ...link,
      createdAt: new Date(link.createdAt),
      updatedAt: link.updatedAt ? new Date(link.updatedAt) : null,
    };
  });

  const page = {
    ...draftBlock.page,
    createdAt: new Date(draftBlock.page.createdAt),
    updatedAt: draftBlock.page.updatedAt
      ? new Date(draftBlock.page.updatedAt)
      : null,
  };

  return {
    ...draftBlock,
    createdAt: new Date(draftBlock.createdAt),
    updatedAt: draftBlock.updatedAt ? new Date(draftBlock.updatedAt) : null,
    headings,
    checkboxes,
    paragraphs,
    listItems,
    links,
    page,
  };
}

export function swapDisplayOrder(
  items: FlattenBlockItem[],
  oldIndex: number,
  newIndex: number,
): [FlattenBlockItem[], FlattenBlockItem[]] {
  const isSwappedToUp = oldIndex > newIndex;

  const slicedItems = isSwappedToUp
    ? items.slice(newIndex, oldIndex + 1)
    : items.slice(oldIndex, newIndex + 1);

  const sortedItems = slicedItems.map((item, index) => {
    if (isSwappedToUp) {
      if (index === slicedItems.length - 1) {
        return {
          ...item,
          item: {
            ...item.item,
            displayOrder: slicedItems[0]!.item.displayOrder,
          },
        };
      } else {
        return {
          ...item,
          item: {
            ...item.item,
            displayOrder: slicedItems[index + 1]!.item.displayOrder,
          },
        };
      }
    } else {
      if (index === 0) {
        return {
          ...item,
          item: {
            ...item.item,
            displayOrder:
              slicedItems[slicedItems.length - 1]!.item.displayOrder,
          },
        };
      } else {
        return {
          ...item,
          item: {
            ...item.item,
            displayOrder: slicedItems[index - 1]!.item.displayOrder,
          },
        };
      }
    }
  });

  const updatedItems = isSwappedToUp
    ? [
        ...items.slice(0, newIndex),
        ...sortedItems,
        ...items.slice(oldIndex + 1),
      ]
    : [
        ...items.slice(0, oldIndex),
        ...sortedItems,
        ...items.slice(newIndex + 1),
      ];

  return [updatedItems, sortedItems];
}
