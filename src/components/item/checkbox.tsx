"use client";

import { useEffect, useRef, useState } from "react";
import {
  twBgColor,
  twColor,
  twFontSize,
  twFontStyle,
  twFontWeight,
  type CreateNewBlockType,
} from "~/lib/types";
import { cn } from "~/lib/utils";
import {
  deleteCheckbox,
  updateCheckbox,
  updateCheckboxText,
} from "~/server/db/actions/checkbox-actions";
import type {
  BlockWithContent,
  Checkbox as CheckboxType,
} from "~/server/db/schema";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface Props {
  checkbox: CheckboxType;
  onUpdateDraft?: React.Dispatch<React.SetStateAction<BlockWithContent | null>>;
  isDraft?: boolean;
  shouldFocus?: boolean;
  onEnterPress?: (type: CreateNewBlockType, displayOrder: number) => void;
  onFocus?: () => void;
  isPreview?: boolean;
}

export default function CheckboxItem({
  checkbox,
  onUpdateDraft,
  isDraft,
  shouldFocus,
  onEnterPress,
  onFocus,
  isPreview = false,
}: Props) {
  const [checked, setChecked] = useState<boolean>(!!checkbox.checked);
  const [text, setText] = useState(checkbox.text);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLLabelElement>(null);

  const handleCheckboxChange = async (checked: boolean) => {
    if (isPreview) return;
    setChecked(checked);
    try {
      if (isDraft) {
        onUpdateDraft?.((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            checkboxes: prev.checkboxes.map((c) =>
              c.id === checkbox.id ? { ...c, checked } : c,
            ),
          };
        });
      } else {
        await updateCheckbox(checked, checkbox.id);
      }
    } catch (e) {
      setChecked(!checked);
    }
  };

  // For revalidation state after update from db
  useEffect(() => {
    setChecked(checkbox.checked || false);
  }, [checkbox.checked]);

  // For preview state
  useEffect(() => {
    if (isPreview) {
      setChecked(checkbox.checked || false);
    }
  }, [checkbox.checked, isPreview]);

  useEffect(() => {
    if (
      isPreview &&
      contentRef.current &&
      contentRef.current.textContent !== checkbox.text
    ) {
      contentRef.current.textContent = checkbox.text ?? "";
    }
  }, [checkbox.text, isPreview]);

  // Set initial content only once
  useEffect(() => {
    if (contentRef.current && !contentRef.current.textContent) {
      contentRef.current.textContent = checkbox.text ?? "";
    }
  }, [checkbox.text]);

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
    if (text !== checkbox.text) {
      if (isDraft) {
        onUpdateDraft?.((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            checkboxes: prev.checkboxes.map((c) =>
              c.id === checkbox.id ? { ...c, text } : c,
            ),
          };
        });
      } else {
        await updateCheckboxText(checkbox.id, text);
      }
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.blur();
      setIsEditing(false);
      onEnterPress?.("checkbox", checkbox.displayOrder);
    } else if (e.key === "Backspace") {
      if (e.currentTarget.textContent === "" && text === "") {
        if (isDraft) {
          onUpdateDraft?.((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              checkboxes: prev.checkboxes.filter((c) => c.id !== checkbox.id),
            };
          });
          return;
        } else {
          await deleteCheckbox(checkbox.id);
          return;
        }
      }
    }
  };

  const handleInput = async (e: React.FormEvent<HTMLLabelElement>) => {
    setText(e.currentTarget.textContent ?? "");
  };

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 px-1 py-0.5 transition-all duration-200",
        !isEditing && twBgColor[checkbox.bgColor],
        {
          "hover:bg-gray-800": !isEditing && !isPreview,
          "scale-75": isPreview,
        },
      )}
    >
      <Checkbox
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={handleCheckboxChange}
        name={checkbox.text}
        checked={checked}
        id={checkbox.id.toString()}
      />
      <Label
        ref={contentRef}
        contentEditable={!isPreview}
        suppressContentEditableWarning={!isPreview}
        onFocus={() => {
          setIsEditing(true);
          onFocus?.();
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        className={cn(
          "w-full p-1 transition-all duration-200 outline-none hover:cursor-text",
          twFontSize[checkbox.fontSize],
          twFontWeight[checkbox.fontWeight],
          twFontStyle[checkbox.fontStyle],
          twColor[checkbox.color],
          {
            "ring-opacity-50 border-1 border-blue-400": isEditing && !isDraft,
            "ring-opacity-50 border-1 border-white": isEditing && isDraft,
            "text-blue-500": isDraft,
          },
        )}
      >
        {checkbox.text}
      </Label>
    </div>
  );
}
