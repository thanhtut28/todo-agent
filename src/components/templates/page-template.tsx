"use client";
import { useEffect, useState, useTransition } from "react";
import { generateText, type AIGeneratedPage } from "~/server/openai";
import type { BlockWithContent } from "~/server/db/schema";
import Block from "../item/block";
import {
  deleteBlockFromDb,
  generateStructuredContentWithAI,
  saveDraftIntoDb,
} from "~/server/db/actions";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Props {
  pageId: string;
  blocks: BlockWithContent[];
}

export default function PageTemplate({ blocks, pageId }: Props) {
  const [draftBlock, setDraftBlock] = useState<BlockWithContent | null>(null);
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [isDeleting, startDeletingTransition] = useTransition();
  const [focusedBlockId, setFocusedBlockId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = async (formData: FormData) => {
    startGenerationTransition(async () => {
      const lastBlockDisplayOrder =
        blocks[blocks.length - 1]?.displayOrder ?? 0;
      const { success, result } = await generateStructuredContentWithAI(
        formData,
        pageId,
        lastBlockDisplayOrder,
      );
      if (success && result) {
        setDraftBlock(result);
        setRefreshKey((prev) => prev + 1);
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

  return (
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
          {isGenerating ? "Generating..." : isSaving ? "Saving..." : "Generate"}
        </Button>
      </form>
    </div>
  );
}
