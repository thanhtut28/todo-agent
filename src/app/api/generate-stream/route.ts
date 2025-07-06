import { generateBlocksWithAgentStream } from "~/server/db/actions";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { prompt, pageId, lastBlockDisplayOrder } = await request.json();

  if (!prompt) {
    return new Response("Prompt is required", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generateBlocksWithAgentStream(
          prompt,
          pageId,
          lastBlockDisplayOrder,
        )) {
          const data = `data: ${JSON.stringify(chunk)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        const errorData = {
          type: "error",
          content: error instanceof Error ? error.message : "Unknown error",
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
