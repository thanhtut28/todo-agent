"use client";
import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "~/lib/utils";
import { type Heading } from "~/server/db/schema";
import { updateHeadingText } from "~/server/db/actions";
import { twColor, twFontSize, twFontStyle, twFontWeight } from "~/lib/types";
import React from "react";

interface Props {
  heading: Heading;
  onEnterPress?: () => void;
  onFocus?: () => void;
  shouldFocus?: boolean;
  isDraft?: boolean;
}

export default function HeadingItem({
  heading,
  onEnterPress,
  onFocus,
  shouldFocus,
  isDraft,
}: Props) {
  const [text, setText] = useState(heading.text);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLHeadingElement>(null);

  // Set initial content only once
  useEffect(() => {
    if (contentRef.current && !contentRef.current.textContent) {
      contentRef.current.textContent = heading.text || "Type a heading...";
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
      await updateHeadingText(heading.id, text);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnterPress?.();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.textContent ?? "");
  };

  const HeadingComponent = heading.variant as keyof React.JSX.IntrinsicElements;

  return React.createElement(HeadingComponent, {
    ref: contentRef,
    contentEditable: true,
    suppressContentEditableWarning: true,
    className: cn(
      "transition-all duration-200 outline-none",
      twFontSize[heading.fontSize],
      twFontWeight[heading.fontWeight],
      twFontStyle[heading.fontStyle],
      twColor[heading.color],
      {
        "ring-opacity-50 ring-1 ring-blue-400": isEditing && !isDraft,
        "ring-opacity-50 ring-1 ring-white": isEditing && isDraft,
        "hover:bg-gray-800": !isEditing,
        "text-blue-500": isDraft,
      },
    ),
    onFocus: () => {
      setIsEditing(true);
      onFocus?.();
    },
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onInput: handleInput,
  });
}
