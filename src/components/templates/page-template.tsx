"use client";
import { useEffect, useState, useTransition } from "react";
import { consumeStream } from "~/lib/stream-utils";
import {
  convertDateFormatForBlock,
  convertSlicedTextIntoBlockItem,
  createDraftBlock,
  sliceUnbalancedTextFromStream,
} from "~/lib/utils";
import { deleteBlockFromDb, saveDraftIntoDb } from "~/server/db/actions";
import type {
  BlockWithContent,
  Checkbox,
  Heading,
  Link,
  ListItem,
  Paragraph,
} from "~/server/db/schema";
import Block from "../item/block";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DndContext } from "@dnd-kit/core";

interface Props {
  pageId: string;
  blocks: BlockWithContent[];
}

export default function PageTemplate({ blocks, pageId }: Props) {
  const [draftBlock, setDraftBlock] = useState<BlockWithContent | null>(null);
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [isDeleting, startDeletingTransition] = useTransition();
  const [focusedBlockId, setFocusedBlockId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = async (formData: FormData) => {
    const prompt = formData.get("prompt") as string;
    if (!prompt) return;

    startGeneratingTransition(async () => {
      try {
        const lastBlockDisplayOrder =
          blocks[blocks.length - 1]?.displayOrder ?? 0;
        let processedText = "";
        let index = 0;

        for await (const event of consumeStream(
          prompt,
          pageId,
          lastBlockDisplayOrder,
        )) {
          if (event.type === "text_update") {
            const accumulated =
              processedText !== "" && event.accumulated
                ? event.accumulated.slice(processedText.length)
                : event.accumulated;
            const slicedText = sliceUnbalancedTextFromStream(
              accumulated ?? "",
              processedText !== "" ? null : processedText.length,
            );
            const blockItem = convertSlicedTextIntoBlockItem(slicedText);
            if (blockItem) {
              const headings: Heading[] = [];
              const checkboxes: Checkbox[] = [];
              const paragraphs: Paragraph[] = [];
              const listItems: ListItem[] = [];
              const links: Link[] = [];
              const content = blockItem.content;
              switch (blockItem.type) {
                case "heading":
                  headings.push({
                    id: index,
                    text: content.text,
                    blockId: draftBlock?.id ?? 0,
                    fontSize: content.fontSize ?? "md",
                    variant: content.variant ?? "h1",
                    color: content.color ?? "white",
                    fontWeight: content.fontWeight ?? "normal",
                    bgColor: content.bgColor ?? "transparent",
                    fontStyle: content.fontStyle ?? "normal",
                    createdAt: new Date(),
                    updatedAt: null,
                    displayOrder: index,
                  });
                  break;
                case "checkbox":
                  checkboxes.push({
                    id: index,
                    text: content.text,
                    blockId: draftBlock?.id ?? 0,
                    createdAt: new Date(),
                    updatedAt: null,
                    displayOrder: index,
                    checked: false,
                    fontSize: content.fontSize ?? "md",
                    fontWeight: content.fontWeight ?? "normal",
                    color: content.color ?? "white",
                    bgColor: content.bgColor ?? "transparent",
                    fontStyle: content.fontStyle ?? "normal",
                  });
                  break;
                case "paragraph":
                  paragraphs.push({
                    id: index,
                    text: content.text,
                    blockId: draftBlock?.id ?? 0,
                    createdAt: new Date(),
                    updatedAt: null,
                    displayOrder: index,
                    fontSize: content.fontSize ?? "md",
                    fontWeight: content.fontWeight ?? "normal",
                    color: content.color ?? "white",
                    bgColor: content.bgColor ?? "transparent",
                    fontStyle: content.fontStyle ?? "normal",
                  });
                  break;
                case "list":
                  listItems.push({
                    id: index,
                    text: content.text,
                    blockId: draftBlock?.id ?? 0,
                    createdAt: new Date(),
                    updatedAt: null,
                    displayOrder: index,
                    fontSize: content.fontSize ?? "md",
                    fontWeight: content.fontWeight ?? "normal",
                    color: content.color ?? "white",
                    bgColor: content.bgColor ?? "transparent",
                    fontStyle: content.fontStyle ?? "normal",
                    listType: content.listType ?? "ordered",
                  });
                  break;
                case "link":
                  links.push({
                    id: index,
                    text: content.text,
                    blockId: draftBlock?.id ?? 0,
                    createdAt: new Date(),
                    updatedAt: null,
                    displayOrder: index,
                    fontSize: content.fontSize ?? "md",
                    fontWeight: content.fontWeight ?? "normal",
                    color: content.color ?? "white",
                    bgColor: content.bgColor ?? "transparent",
                    fontStyle: content.fontStyle ?? "normal",
                    url: content.url ?? "",
                    underline: true,
                  });
                  break;
              }

              setDraftBlock((prev) => {
                console.log("prev", prev);
                if (!prev) {
                  const draftBlock = createDraftBlock(
                    event.content.pageName ?? "Dummy Page",
                    pageId,
                    lastBlockDisplayOrder,
                  );
                  return {
                    ...draftBlock,
                    headings,
                    checkboxes,
                    paragraphs,
                    listItems,
                    links,
                  };
                } else {
                  return {
                    ...prev,
                    headings: [...prev.headings, ...headings],
                    checkboxes: [...prev.checkboxes, ...checkboxes],
                    paragraphs: [...prev.paragraphs, ...paragraphs],
                    listItems: [...prev.listItems, ...listItems],
                    links: [...prev.links, ...links],
                  };
                }
              });

              processedText = event.accumulated ?? "";
              index++;
            }
          } else if (event.type === "final_result") {
            try {
              const finalResult = convertDateFormatForBlock(event.content);
              setDraftBlock(finalResult);
            } catch (error) {
              console.error(
                "Failed to process final result, keeping incremental draft:",
                error,
              );
              // Keep the current draftBlock from incremental parsing
              // The incremental version might be incomplete but is better than nothing
            }
            setRefreshKey((prev) => prev + 1);
            break;
          } else if (event.type === "error") {
            console.error("Streaming error:", event.content);
            // setDraftBlock(null);
            break;
          }
        }
      } catch (error) {
        console.error("Generation failed:", error);
      }
    });
  };

  const handleSaveDraft = async (draft: BlockWithContent) => {
    console.log("save draft", draft);
    startSavingTransition(async () => {
      const { success } = await saveDraftIntoDb(draft);
      if (success) {
        setDraftBlock(null);
      }
    });
  };

  const handleDiscardDraft = () => {
    setDraftBlock(null);
  };

  const handleDeleteBlock = async (id: number) => {
    startDeletingTransition(async () => {
      const { success } = await deleteBlockFromDb(id, pageId);
      if (success) {
        setDraftBlock(null);
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        // Show block type menu logic can be added here
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  console.log("focusedBlockId", focusedBlockId);

  return (
    <DndContext>
      <div className="space-y-6">
        {blocks.map((block) => (
          <Block
            onFocus={setFocusedBlockId}
            shouldFocus={focusedBlockId === block.id}
            key={`${block.id}-${refreshKey}`}
            onDeleteBlock={handleDeleteBlock}
            block={block}
          />
        ))}

        {draftBlock && (
          <Block
            onUpdateDraft={setDraftBlock}
            onDiscardDraft={handleDiscardDraft}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving || isDeleting}
            key={`${draftBlock.id}-${refreshKey}`}
            block={draftBlock}
            isDraft={true}
          />
        )}

        <form action={handleGenerate} className="flex items-center gap-2">
          <Input className="border border-white" type="text" name="prompt" />
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? `Generating` : isSaving ? "Saving..." : "Generate"}
          </Button>
        </form>
      </div>
    </DndContext>
  );
}
