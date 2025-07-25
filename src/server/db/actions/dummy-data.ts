import type { BlockWithContent } from "../schema";

export const getPlaceholderBlock = (pageId: number): BlockWithContent => ({
  id: 1,
  text: "Getting Started",
  pageId,
  createdAt: new Date(),
  updatedAt: new Date(),
  displayOrder: 0,
  checkboxes: [],
  links: [],
  page: {
    id: pageId,
    name: "Getting Started",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "1",
  },
  headings: [
    {
      id: 1,
      text: "Getting Started",
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 1,
      variant: "h1",
      fontSize: "2xl",
      fontWeight: "bold",
      color: "white",
      bgColor: "transparent",
      fontStyle: "normal",
      blockId: 1,
    },
  ],
  paragraphs: [
    {
      id: 1,
      text: "Welcome to the Getting Started page. you can start by creating a new page or editing this page.",
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 2,
      blockId: 1,
      fontSize: "md",
      fontWeight: "normal",
      color: "white",
      bgColor: "transparent",
      fontStyle: "normal",
    },
  ],
  listItems: [
    {
      id: 1,
      text: "You can create your tasks and notes yourself or use the AI to generate them for you.",
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 2,
      blockId: 1,
      fontSize: "md",
      fontWeight: "normal",
      color: "white",
      bgColor: "transparent",
      fontStyle: "normal",
      listType: "unordered",
    },
    {
      id: 2,
      text: "You can edit the page name and description to make it more personalized.",
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 3,
      blockId: 1,
      fontSize: "md",
      fontWeight: "normal",
      color: "white",
      bgColor: "transparent",
      fontStyle: "normal",
      listType: "unordered",
    },
    {
      id: 3,
      text: "You can move the blocks around to change the order by dragging and dropping.",
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 4,
      blockId: 1,
      fontSize: "md",
      fontWeight: "normal",
      color: "white",
      bgColor: "transparent",
      fontStyle: "normal",
      listType: "unordered",
    },
    {
      id: 4,
      text: "You can edit the blocks by clicking the block and typing in the text editor or by clicking the edit button.",
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 5,
      blockId: 1,
      fontSize: "md",
      fontWeight: "normal",
      color: "white",
      bgColor: "transparent",
      fontStyle: "normal",
      listType: "unordered",
    },
  ],
});

export const placeholderPage = {
  name: "Getting Started",
  createdAt: new Date(),
  updatedAt: new Date(),
  blocks: [],
};
