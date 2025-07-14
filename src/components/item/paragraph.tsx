"use client";
import type { KeyboardEvent } from "react";
import React, { useEffect, useRef, useState } from "react";
import {
  twBgColor,
  twColor,
  twFontSize,
  twFontStyle,
  twFontWeight,
  type CreateNewBlockType,
} from "~/lib/types";
import { cn } from "~/lib/utils";
import { updateParagraphText } from "~/server/db/actions";
import { type BlockWithContent, type Paragraph } from "~/server/db/schema";

interface Props {
  paragraph: Paragraph;
  onEnterPress?: (type: CreateNewBlockType, displayOrder: number) => void;
  onFocus?: () => void;
  shouldFocus?: boolean;
  isDraft?: boolean;
  onUpdateDraft?: React.Dispatch<React.SetStateAction<BlockWithContent | null>>;
  isPreview?: boolean;
}

export default function ParagraphItem({
  paragraph,
  onEnterPress,
  onFocus,
  shouldFocus,
  onUpdateDraft,
  isDraft,
  isPreview = false,
}: Props) {
  const [text, setText] = useState(paragraph.text);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (
      isPreview &&
      contentRef.current &&
      contentRef.current.textContent !== paragraph.text
    ) {
      contentRef.current.textContent = paragraph.text ?? "";
    }
  }, [paragraph.text, isPreview]);

  // Set initial content only once
  useEffect(() => {
    if (contentRef.current && !contentRef.current.textContent) {
      contentRef.current.textContent = paragraph.text ?? "";
    }
  }, [paragraph.text]);

  useEffect(() => {
    if (shouldFocus && contentRef.current) {
      contentRef.current.focus();
      // Move cursor to end
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [shouldFocus]);

  const handleBlur = async () => {
    setIsEditing(false);
    if (text !== paragraph.text) {
      if (isDraft) {
        onUpdateDraft?.((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            paragraphs: prev.paragraphs.map((p) =>
              p.id === paragraph.id ? { ...p, text } : p,
            ),
          };
        });
      } else {
        await updateParagraphText(paragraph.id, text);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnterPress?.("paragraph", paragraph.displayOrder);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.textContent ?? "");
  };

  return (
    <p
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => {
        setIsEditing(true);
        onFocus?.();
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      className={cn(
        "transition-all duration-200 outline-none",
        {
          "ring-opacity-50 ring-1 ring-blue-400": isEditing && !isDraft,
          "ring-opacity-50 ring-1 ring-white": isEditing && isDraft,
          "hover:bg-gray-800": !isEditing,
          "text-blue-500": isDraft,
          "scale-75": isPreview,
        },
        twFontSize[paragraph.fontSize],
        twFontWeight[paragraph.fontWeight],
        twFontStyle[paragraph.fontStyle],
        twColor[paragraph.color],
        twBgColor[paragraph.bgColor],
      )}
    />
  );
}
