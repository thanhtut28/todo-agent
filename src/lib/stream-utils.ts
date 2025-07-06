export interface StreamEvent {
  type: "text_update" | "final_result" | "error";
  content: any;
  accumulated?: string;
}

export async function* consumeStream(
  prompt: string,
  pageId: string,
  lastBlockDisplayOrder: number,
): AsyncGenerator<StreamEvent, void, unknown> {
  const response = await fetch("/api/generate-stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      pageId,
      lastBlockDisplayOrder,
    }),
  });

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            return;
          }

          try {
            const parsed = JSON.parse(data) as StreamEvent;
            yield parsed;
          } catch (error) {
            // Skip malformed chunks in streaming - this is expected
            console.warn("Skipping malformed streaming chunk:", data);
            continue; // Skip this chunk, continue processing
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function useStreamingGeneration() {
  return {
    async *generateWithStream(
      prompt: string,
      pageId: string,
      lastBlockDisplayOrder: number,
      onTextUpdate?: (text: string, accumulated: string) => void,
      onFinalResult?: (result: any) => void,
      onError?: (error: string) => void,
    ) {
      try {
        for await (const event of consumeStream(
          prompt,
          pageId,
          lastBlockDisplayOrder,
        )) {
          if (event.type === "text_update") {
            onTextUpdate?.(event.content, event.accumulated ?? "");
          } else if (event.type === "final_result") {
            onFinalResult?.(event.content);
          } else if (event.type === "error") {
            onError?.(event.content);
          }
          yield event;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        onError?.(errorMessage);
        yield {
          type: "error" as const,
          content: errorMessage,
        };
      }
    },
  };
}
