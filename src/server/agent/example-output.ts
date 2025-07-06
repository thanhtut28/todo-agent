import type { BlockGenerationOutput } from "./tool";

export const exampleOutputs: Record<string, BlockGenerationOutput> = {
  "todo-list": {
    pageName: "Today's Tasks",
    blocks: [
      {
        type: "heading",
        content: {
          text: "Today's Tasks",
          fontSize: "2xl",
          fontWeight: "bold",
          color: "white",
          bgColor: "transparent",
          fontStyle: "normal",
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Buy groceries",
          checked: false,
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Finish the project",
          checked: false,
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Clean the house",
          checked: false,
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Drink water",
          checked: false,
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Go to the gym",
          checked: false,
        },
      },
    ],
  },
  animals: {
    pageName: "Animals",
    blocks: [
      {
        type: "heading",
        content: {
          text: "Animals",
          fontSize: "2xl",
          fontWeight: "bold",
          color: "white",
          bgColor: "transparent",
          fontStyle: "normal",
        },
      },
      {
        type: "list",
        content: {
          listType: "unordered",
          text: "Dog",
        },
      },
      {
        type: "list",
        content: {
          listType: "unordered",
          text: "Cat",
        },
      },
      {
        type: "list",
        content: {
          listType: "unordered",
          text: "Bird",
        },
      },
      {
        type: "list",
        content: {
          listType: "unordered",
          text: "Fish",
        },
      },
      {
        type: "list",
        content: {
          listType: "unordered",
          text: "Snake",
        },
      },
    ],
  },
  roadmap: {
    pageName: "Roadmap for frontend development",
    blocks: [
      {
        type: "heading",
        content: {
          text: "Roadmap",
          variant: "h3",
          fontSize: "2xl",
          fontWeight: "bold",
          color: "white",
          bgColor: "transparent",
          fontStyle: "normal",
        },
      },
      {
        type: "heading",
        content: {
          variant: "h4",
          text: "Phase 1",
          fontSize: "xl",
          fontWeight: "bold",
          color: "white",
          bgColor: "transparent",
          fontStyle: "normal",
        },
      },
      {
        type: "paragraph",
        content: {
          text: "This phase is about learning the basics of frontend development. It will take 2 weeks.",
          fontSize: "md",
          fontWeight: "normal",
          color: "white",
          bgColor: "transparent",
          fontStyle: "normal",
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Learn HTML",
          checked: false,
          bgColor: "red",
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Learn CSS",
          checked: false,
          bgColor: "red",
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Learn JavaScript",
          checked: false,
          bgColor: "red",
        },
      },
      {
        type: "heading",
        content: {
          text: "Phase 2",
          variant: "h4",
          fontSize: "xl",
          fontWeight: "bold",
          color: "white",
          bgColor: "transparent",
          fontStyle: "normal",
        },
      },
      {
        type: "paragraph",
        content: {
          text: "This phase is about learning the frontend frameworks and libraries. It will take 2 weeks.",
          fontSize: "md",
          fontWeight: "normal",
          color: "white",
          bgColor: "transparent",
          fontStyle: "normal",
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Learn React",
          checked: false,
          bgColor: "orange",
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Learn Next.js",
          checked: false,
          bgColor: "yellow",
        },
      },
      {
        type: "checkbox",
        content: {
          text: "Learn TypeScript",
          checked: false,
        },
      },
      {
        type: "link",
        content: {
          text: "Learn Tailwind CSS",
          url: "https://tailwindcss.com",
        },
      },
      {
        type: "link",
        content: {
          text: "Learn Shadcn UI",
          url: "https://ui.shadcn.com",
        },
      },
    ],
  },
};
