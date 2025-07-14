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
import { updateListItemText } from "~/server/db/actions";
import { type BlockWithContent, type ListItem } from "~/server/db/schema";

interface Props {
  listItem: ListItem;
  onEnterPress?: (type: CreateNewBlockType, displayOrder: number) => void;
  onFocus?: () => void;
  shouldFocus?: boolean;
  isDraft?: boolean;
  onUpdateDraft?: React.Dispatch<React.SetStateAction<BlockWithContent | null>>;
  isPreview?: boolean;
}

export default function ListItem({
  listItem,
  onEnterPress,
  onFocus,
  shouldFocus,
  onUpdateDraft,
  isDraft,
  isPreview = false,
}: Props) {
  const [text, setText] = useState(listItem.text);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (
      isPreview &&
      contentRef.current &&
      contentRef.current.textContent !== listItem.text
    ) {
      contentRef.current.textContent = listItem.text ?? "";
    }
  }, [listItem.text, isPreview]);

  // Set initial content only once
  useEffect(() => {
    if (contentRef.current && !contentRef.current.textContent) {
      contentRef.current.textContent = listItem.text ?? "";
    }
  }, [listItem.text]);

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
    if (text !== listItem.text) {
      if (isDraft) {
        onUpdateDraft?.((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            paragraphs: prev.paragraphs.map((p) =>
              p.id === listItem.id ? { ...p, text } : p,
            ),
          };
        });
      } else {
        await updateListItemText(listItem.id, text);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnterPress?.("list", listItem.displayOrder);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.textContent ?? "");
  };

  return (
    <div
      className={cn("flex items-center gap-2", {
        "scale-75": isPreview,
      })}
    >
      <span className="aspect-square h-2 w-2 rounded-full bg-gray-300" />
      <div
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
          },
          twFontSize[listItem.fontSize],
          twFontWeight[listItem.fontWeight],
          twFontStyle[listItem.fontStyle],
          twColor[listItem.color],
          twBgColor[listItem.bgColor],
        )}
      />
    </div>
  );
}
