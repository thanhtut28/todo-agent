"use server";

import { run } from "@openai/agents";
import { blockGenerationOutput } from "../../agent/tool";
import agent from "../../agent/agent";
import { covertAIGeneratedContentToBlockWithContent } from "~/lib/utils";

export async function generateBlocksWithAgent(
  formData: FormData,
  pageId: string,
  lastBlockDisplayOrder: number,
) {
  const prompt = formData.get("prompt") as string;

  if (!prompt) {
    return { success: false, error: "Prompt is required" };
  }

  try {
    const result = await run(agent, prompt, { stream: false });
    const jsonParsed = JSON.parse(result.finalOutput ?? "{}");
    const parsedResult = blockGenerationOutput.parse(jsonParsed);

    const blockWithContent = covertAIGeneratedContentToBlockWithContent(
      parsedResult,
      pageId,
      lastBlockDisplayOrder,
    );

    return { success: true, result: blockWithContent };
  } catch (error) {
    console.error("Error generating blocks with agent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function* generateBlocksWithAgentStream(
  prompt: string,
  pageId: string,
  lastBlockDisplayOrder: number,
) {
  try {
    const result = await run(agent, prompt, { stream: true });

    // Get the text stream for progressive text updates
    const textStream = result.toTextStream();
    let accumulatedText = "";

    // Stream text updates
    for await (const textChunk of textStream) {
      accumulatedText += textChunk;
      yield {
        type: "text_update",
        content: textChunk,
        accumulated: accumulatedText,
      };
    }

    // Wait for completion to ensure all output is flushed
    await result.completed;

    // Get final result after streaming is complete
    const finalOutput = result.finalOutput;
    if (finalOutput) {
      try {
        const jsonParsed = JSON.parse(finalOutput);
        const parsedResult = blockGenerationOutput.parse(jsonParsed);

        const blockWithContent = covertAIGeneratedContentToBlockWithContent(
          parsedResult,
          pageId,
          lastBlockDisplayOrder,
        );

        yield {
          type: "final_result",
          content: blockWithContent,
        };
      } catch (parseError) {
        console.error("Failed to parse final AI output:", {
          error: parseError,
          rawOutput: finalOutput,
        });
        yield {
          type: "error",
          content: `Failed to parse generated content: ${parseError instanceof Error ? parseError.message : "Unknown parsing error"}`,
        };
      }
    } else {
      // No final output received - this shouldn't happen normally
      yield {
        type: "error",
        content: "No final output received from AI agent",
      };
    }
  } catch (error) {
    yield {
      type: "error",
      content: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
