import { tool } from "@openai/agents";
import { z } from "zod";

export const blockGenerationTool = tool({
  name: "generate_block",
  description: "Generate structured blocks for a page based on user prompt",
  parameters: z.object({
    prompt: z.string().describe("The user prompt to generate content from"),
  }),
  strict: true,

  execute: async (input) => {
    const { prompt } = input;

    // The Agent will handle the LLM call and content generation
    // This tool just validates and returns the prompt for processing
    return {
      message: `Processing content generation for: ${prompt}`,
      prompt: prompt,
    };
  },
});

// Keep these for type checking in other parts of the application if needed
export const blockItem = z.object({
  type: z.enum(["heading", "paragraph", "checkbox", "list", "link"]),
  content: z.object({
    text: z.string(),
    variant: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional(),
    checked: z.boolean().optional(),
    url: z.string().optional(),
    listType: z.enum(["ordered", "unordered", "numbered"]).optional(),
    fontSize: z
      .enum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"])
      .optional(),
    fontWeight: z
      .enum([
        "thin",
        "extralight",
        "light",
        "normal",
        "medium",
        "semibold",
        "bold",
      ])
      .optional(),
    color: z
      .enum([
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
      ])
      .optional(),
    bgColor: z
      .enum([
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
      ])
      .optional(),
    fontStyle: z.enum(["normal", "italic", "oblique"]).optional(),
  }),
});

export const blockGenerationOutput = z.object({
  pageName: z.string(),
  blocks: z.array(blockItem),
});

export type BlockItem = z.infer<typeof blockItem>;
export type BlockGenerationOutput = z.infer<typeof blockGenerationOutput>;
