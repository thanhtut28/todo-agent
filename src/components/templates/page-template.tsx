"use client";
import { useState } from "react";
import { generateText } from "~/server/openai";
import type { BlockWithContent } from "~/server/db/schema";
import Block from "../item/block";

interface Props {
  pageId: string;
  blocks: BlockWithContent[];
}

export default function PageTemplate({ blocks }: Props) {
  const [textResult, setTextResult] = useState<string>("");

  const handleGenerate = async (formData: FormData) => {
    setTextResult("");
    const prompt = formData.get("prompt");
    const stream = await generateText(prompt as string);
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta.content;
      if (text) {
        setTextResult((prev) => prev + text);
      }
    }
  };

  return (
    <>
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}

      <form action={handleGenerate}>
        <input className="border border-white" type="text" name="prompt" />
        <button type="submit">Generate</button>
        {textResult && textResult.trim().length > 0 && <p>{textResult}</p>}
      </form>
    </>
  );
}
