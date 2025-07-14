"use client";
import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "~/lib/utils";
import { type BlockWithContent, type Heading } from "~/server/db/schema";
import { updateHeadingText } from "~/server/db/actions";
import {
  twBgColor,
  twColor,
  twFontSize,
  twFontStyle,
  twFontWeight,
  type CreateNewBlockType,
} from "~/lib/types";
import React from "react";

interface Props {
  heading: Heading;
  onEnterPress?: (type: CreateNewBlockType, displayOrder: number) => void;
  onFocus?: () => void;
  shouldFocus?: boolean;
  isDraft?: boolean;
  onUpdateDraft?: React.Dispatch<React.SetStateAction<BlockWithContent | null>>;
  isPreview?: boolean;
}

export default function HeadingItem({
  heading,
  onEnterPress,
  onFocus,
  shouldFocus,
  isDraft,
  onUpdateDraft,
  isPreview = false,
}: Props) {
  const [text, setText] = useState(heading.text);
  const [isEditing, setIsEditing] = useState(false);
  const [variant, setVariant] = useState(heading.variant);
  const contentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setText(heading.text);
    setVariant(heading.variant);
  }, [heading.text, heading.variant]);

  useEffect(() => {
    if (isPreview) {
      setText(heading.text);
      setVariant(heading.variant);
    }
  }, [heading.variant, isPreview, heading.text]);

  useEffect(() => {
    if (
      isPreview &&
      contentRef.current &&
      contentRef.current.textContent !== heading.text
    ) {
      contentRef.current.textContent = heading.text ?? "";
    }
  }, [heading.text, isPreview]);

  // Set initial content only once
  useEffect(() => {
    if (contentRef.current && !contentRef.current.textContent) {
      contentRef.current.textContent = heading.text ?? "";
    }
  }, [heading.text]);

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
    if (text !== heading.text) {
      if (isDraft) {
        onUpdateDraft?.((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            headings: prev.headings.map((h) =>
              h.id === heading.id ? { ...h, text } : h,
            ),
          };
        });
      } else {
        await updateHeadingText(heading.id, text);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnterPress?.("heading", heading.displayOrder);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.textContent ?? "");
  };

  return (
    <div
      ref={contentRef}
      role="heading"
      aria-level={
        variant === "h1"
          ? 1
          : variant === "h2"
            ? 2
            : variant === "h3"
              ? 3
              : variant === "h4"
                ? 4
                : variant === "h5"
                  ? 5
                  : 6
      }
      contentEditable={!isPreview}
      suppressContentEditableWarning={!isPreview}
      className={cn(
        "px-1 py-0.5 transition-all duration-200 outline-none",
        twFontSize[heading.fontSize],
        twFontWeight[heading.fontWeight],
        twFontStyle[heading.fontStyle],
        twColor[heading.color],
        twBgColor[heading.bgColor],
        {
          "ring-opacity-50 ring-1 ring-blue-400": isEditing && !isDraft,
          "ring-opacity-50 ring-1 ring-white": isEditing && isDraft,
          "hover:bg-gray-800": !isEditing && !isPreview,
          "text-blue-500": isDraft,
          "scale-75": isPreview,
        },
      )}
      onFocus={() => {
        setIsEditing(true);
        onFocus?.();
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
    />
  );
}
