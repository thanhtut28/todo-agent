import { Trash2Icon } from "lucide-react";
import { type ButtonHTMLAttributes } from "react";
import {
  cn,
  flattenBlockItems,
  type BlockItemType,
  type BlockItemVariant,
} from "~/lib/utils";
import type { BlockWithContent } from "~/server/db/schema";
import type {
  Checkbox as CheckboxType,
  Heading as HeadingType,
  Paragraph as ParagraphType,
  ListItem as ListItemType,
  Link as LinkType,
} from "~/server/db/schema";
import { Button } from "../ui/button";
import CheckboxItem from "./checkbox";
import HeadingItem from "./heading";

interface Props {
  block: BlockWithContent;
  isDraft?: boolean;
  isSaving?: boolean;
  onSaveDraft?: (draft: BlockWithContent) => void;
  onDiscardDraft?: () => void;
  onUpdateDraft?: React.Dispatch<React.SetStateAction<BlockWithContent | null>>;
  onDeleteBlock?: (id: number) => void;
  onFocus?: (blockId: number) => void;
  shouldFocus?: boolean;
}

export default function BlockItem({
  block,
  isDraft,
  onSaveDraft,
  onDiscardDraft,
  isSaving,
  onDeleteBlock,
  onUpdateDraft,
  onFocus,
  shouldFocus,
}: Props) {
  console.log(shouldFocus);

  const handleCreateNewBlock = (type: "heading" | "checkbox" | "paragraph") => {
    //
    console.log("create new block", type);
  };

  const handleEnterPress = () => {
    handleCreateNewBlock("checkbox");
  };

  function renderBlockItem(item: {
    variant: BlockItemVariant;
    item: BlockItemType;
  }) {
    switch (item.variant) {
      case "heading":
        return (
          <HeadingItem
            key={item.item.id}
            heading={item.item as HeadingType}
            onEnterPress={handleEnterPress}
            onFocus={() => onFocus?.(item.item.id)}
            shouldFocus={shouldFocus}
            isDraft={isDraft}
          />
        );
      case "checkbox":
        return (
          <CheckboxItem
            isDraft={isDraft}
            onUpdateDraft={onUpdateDraft}
            key={item.item.id}
            checkbox={item.item as CheckboxType}
            onEnterPress={handleEnterPress}
            onFocus={() => onFocus?.(item.item.id)}
            shouldFocus={shouldFocus}
          />
        );
      default:
        return null;
      // case "paragraph":
      //   return <ParagraphItem paragraph={item} />;
      // case "list":
      //   return <ListItemItem listItem={item} />;
      // case "link":
      //   return <LinkItem link={item} />;
    }
  }

  const flattenedBlockItems = flattenBlockItems(block);

  return (
    <div>
      <div
        className={cn("group relative p-4", {
          "bg-gray-900/50": isDraft,
          "opacity-50": isSaving,
        })}
      >
        <div
          className={cn("flex items-start justify-between", {
            // "bg-blue-500": shouldFocus,
          })}
          onDoubleClick={() => onFocus?.(block.id)}
        >
          <div className={cn("flex h-full w-full flex-col", {})}>
            {flattenedBlockItems.map((item) => renderBlockItem(item))}
          </div>
          {!isDraft && onDeleteBlock && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteBlock(block.id)}
            >
              <Trash2Icon className="h-4 w-4 text-red-800" />
            </Button>
          )}
        </div>
      </div>
      {isDraft && (
        <div className="flex items-center justify-end">
          <DraftActionButton
            onClick={onDiscardDraft}
            disabled={isSaving}
            isPrimaryAction={false}
          >
            Discard
          </DraftActionButton>
          <DraftActionButton
            isPrimaryAction
            onClick={() => onSaveDraft?.(block)}
            disabled={isSaving}
          >
            Save
          </DraftActionButton>
        </div>
      )}
    </div>
  );
}

interface DraftActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isPrimaryAction?: boolean;
}

const DraftActionButton = ({
  children,
  isPrimaryAction,
  ...props
}: DraftActionButtonProps) => {
  return (
    <Button
      {...props}
      className={cn(
        "-mt-[1px] h-4 w-14 rounded-b-[10px] border-0 text-[8px] font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-green-500 hover:bg-green-600": isPrimaryAction,
          "bg-red-500 hover:bg-red-600": !isPrimaryAction,
        },
      )}
    >
      {children}
    </Button>
  );
};
