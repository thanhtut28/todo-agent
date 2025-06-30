"use server";

import { openai } from ".";
import { db } from "./db";
import {
  pages,
  blocks,
  checkboxes,
  headings,
  paragraphs,
  links,
  listItems,
} from "./db/schema";
import { revalidateTag } from "next/cache";

// Types for AI-generated content
export interface AIGeneratedBlock {
  type: "heading" | "paragraph" | "checkbox" | "list" | "link";
  content: {
    text: string;
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    checked?: boolean;
    url?: string;
    listType?: "ordered" | "unordered" | "numbered";
    fontSize?:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl";
    fontWeight?:
      | "thin"
      | "extralight"
      | "light"
      | "normal"
      | "medium"
      | "semibold"
      | "bold";
    color?:
      | "red"
      | "orange"
      | "yellow"
      | "green"
      | "blue"
      | "white"
      | "black"
      | "gray"
      | "purple"
      | "pink"
      | "brown"
      | "cyan"
      | "teal"
      | "transparent";
  };
}

export interface AIGeneratedPage {
  pageName: string;
  blocks: AIGeneratedBlock[];
}

// System prompt for structured content generation
const SYSTEM_PROMPT = `You are a content generation AI for a Notion-like todo/note-taking app. Your job is to generate structured content based on user prompts.

AVAILABLE CONTENT TYPES:
1. heading: For titles and sections (h1-h6)
2. paragraph: For text content and descriptions
3. checkbox: For todo items and tasks
4. list: For ordered/unordered lists
5. link: For external references

RESPONSE FORMAT: Return ONLY valid JSON matching this exact schema:
{
  "pageName": "string",
  "blocks": [
    {
      "type": "heading|paragraph|checkbox|list|link",
      "content": {
        "text": "string",
        "variant": "h1|h2|h3|h4|h5|h6", // only for heading
        "checked": boolean, // only for checkbox, default false
        "url": "string", // only for link
        "listType": "ordered|unordered|numbered", // only for list
        "fontSize": "xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl", // optional
        "fontWeight": "normal|medium|semibold|bold", // optional
        "color": "black|blue|green|red|gray" // optional, keep it simple
      }
    }
  ]
}

EXAMPLES:
User: "create a grocery list"
Response: {
  "pageName": "Grocery List",
  "blocks": [
    {"type": "heading", "content": {"text": "Grocery List", "variant": "h1", "fontSize": "2xl", "fontWeight": "bold"}},
    {"type": "checkbox", "content": {"text": "Eggs", "checked": false}},
    {"type": "checkbox", "content": {"text": "Milk", "checked": false}},
    {"type": "checkbox", "content": {"text": "Bread", "checked": false}},
    {"type": "checkbox", "content": {"text": "Vegetables", "checked": false}}
  ]
}

User: "plan my day"
Response: {
  "pageName": "Daily Plan",
  "blocks": [
    {"type": "heading", "content": {"text": "Today's Schedule", "variant": "h1", "fontSize": "2xl", "fontWeight": "bold"}},
    {"type": "checkbox", "content": {"text": "Morning workout", "checked": false}},
    {"type": "checkbox", "content": {"text": "Check emails", "checked": false}},
    {"type": "checkbox", "content": {"text": "Team meeting at 2pm", "checked": false}},
    {"type": "checkbox", "content": {"text": "Grocery shopping", "checked": false}}
  ]
}

RULES:
- Always include a main heading as the first block
- Use appropriate content types for the context
- For lists/todos, use checkbox type
- Keep text concise and actionable
- Default checkbox to false (unchecked)
- Use reasonable font sizes (md for normal, 2xl for main headings)
- Stick to common colors: black, blue, green, red, gray`;

export async function generateText(prompt: string) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    stream: true,
    max_completion_tokens: 800,
    temperature: 0.7,
  });

  return stream;
}

export async function generateStructuredContent(
  prompt: string,
): Promise<AIGeneratedPage> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    stream: false,
    max_completion_tokens: 800,
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content generated");
  }

  try {
    const parsed = JSON.parse(content) as AIGeneratedPage;
    return parsed;
  } catch (error) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Invalid AI response format");
  }
}

export async function createPageFromAI(
  prompt: string,
): Promise<{ success: boolean; pageId?: number; error?: string }> {
  try {
    // Generate structured content
    const aiContent = await generateStructuredContent(prompt);
    console.log(aiContent);

    // Create page
    const [newPage] = await db
      .insert(pages)
      .values({ name: aiContent.pageName })
      .returning();

    if (!newPage) {
      throw new Error("Failed to create page");
    }

    // Process each block
    for (const aiBlock of aiContent.blocks) {
      // Create the main block
      const [block] = await db
        .insert(blocks)
        .values({
          text: aiBlock.content.text,
          pageId: newPage.id,
        })
        .returning();

      if (!block) continue;

      // Create specific content based on type
      switch (aiBlock.type) {
        case "heading":
          await db.insert(headings).values({
            text: aiBlock.content.text,
            blockId: block.id,
            variant: aiBlock.content.variant ?? "h2",
            fontSize: aiBlock.content.fontSize ?? "2xl",
            fontWeight: aiBlock.content.fontWeight ?? "bold",
            color: aiBlock.content.color ?? "black",
          });
          break;

        case "paragraph":
          await db.insert(paragraphs).values({
            text: aiBlock.content.text,
            blockId: block.id,
            fontSize: aiBlock.content.fontSize ?? "md",
            fontWeight: aiBlock.content.fontWeight ?? "normal",
            color: aiBlock.content.color ?? "black",
          });
          break;

        case "checkbox":
          await db.insert(checkboxes).values({
            text: aiBlock.content.text,
            blockId: block.id,
            checked: aiBlock.content.checked ?? false,
            fontSize: aiBlock.content.fontSize ?? "md",
            fontWeight: aiBlock.content.fontWeight ?? "normal",
            color: aiBlock.content.color ?? "black",
          });
          break;

        case "list":
          await db.insert(listItems).values({
            text: aiBlock.content.text,
            blockId: block.id,
            listType: aiBlock.content.listType ?? "unordered",
            fontSize: aiBlock.content.fontSize ?? "md",
            fontWeight: aiBlock.content.fontWeight ?? "normal",
            color: aiBlock.content.color ?? "black",
          });
          break;

        case "link":
          await db.insert(links).values({
            text: aiBlock.content.text,
            url: aiBlock.content.url ?? "#",
            blockId: block.id,
            fontSize: aiBlock.content.fontSize ?? "md",
            fontWeight: aiBlock.content.fontWeight ?? "medium",
            color: aiBlock.content.color ?? "blue",
          });
          break;
      }
    }

    // Revalidate cache
    revalidateTag("pages");
    revalidateTag("blocks");
    revalidateTag(`page-${newPage.id}`);

    return { success: true, pageId: newPage.id };
  } catch (error) {
    console.error("Error creating AI-generated page:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function generateAndStreamContent(prompt: string) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    stream: true,
    max_completion_tokens: 800,
    temperature: 0.7,
  });

  return stream;
}
