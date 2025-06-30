import { OpenAI } from "openai";
import { env } from "~/env";

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const items = [
  "page",
  "block",
  "heading",
  "paragraph",
  "link",
  "checkbox",
];
