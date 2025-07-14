import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVerticalIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState, type ButtonHTMLAttributes } from "react";
import type { CreateNewBlockType } from "~/lib/types";
import {
  cn,
  flattenBlockItems,
  swapDisplayOrder,
  type FlattenBlockItem,
} from "~/lib/utils";
import { createNewBlockItem, updateBlock } from "~/server/db/actions";
import type { BlockWithContent } from "~/server/db/schema";
import SortableItem from "../sortable/sortable-item";
import { Button } from "../ui/button";
import RenderBlockItem from "./render-block-item";

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

// New SortableItem component

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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [items, setItems] = useState<FlattenBlockItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initialize items after component mounts to prevent hydration issues
  useEffect(() => {
    setItems(flattenBlockItems(block));
    setMounted(true);
  }, [block]);

  const handleCreateNewBlock = async (
    type: CreateNewBlockType = "placeholder",
    displayOrder = 0,
  ) => {
    const toUpdateItems = items.filter(
      (item) => item.item.displayOrder > displayOrder,
    );
    const { result } = await createNewBlockItem({
      type,
      displayOrder,
      blockId: block.id,
      toUpdateItems,
    });

    if (result) {
      onFocus?.(result.id);
    }
  };

  const handleEnterPress = async (
    type: CreateNewBlockType = "placeholder",
    displayOrder = 0,
  ) => {
    await handleCreateNewBlock(type, displayOrder);
  };

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.item.id === active.id);
      const newIndex = items.findIndex((item) => item.item.id === over?.id);

      // const newItems = arrayMove(items, oldIndex, newIndex);

      // Update display order for the reordered items

      const [updatedItems, sortedItems] = swapDisplayOrder(
        items,
        oldIndex,
        newIndex,
      );

      if (!updatedItems) return;

      try {
        setItems(updatedItems);
        await updateBlock(sortedItems);
      } catch (e) {
        console.error("Fail to sort items", e);
      }
    }
  }

  // Render without drag and drop before hydration
  if (!mounted) {
    return (
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
          <div
            className={cn(
              "flex h-full w-full flex-col gap-1.5 transition-all duration-200",
              {
                "opacity-50": isSaving,
              },
            )}
          >
            {flattenBlockItems(block).map((item) => (
              <div
                key={`placeholder-${item.item.id}`}
                className="flex items-center gap-2"
              >
                <GripVerticalIcon className="h-4 w-4 text-gray-500" />
                <RenderBlockItem
                  item={item}
                  isDraft={isDraft}
                  onUpdateDraft={onUpdateDraft}
                  onFocus={onFocus}
                  onEnterPress={handleEnterPress}
                  shouldFocus={shouldFocus}
                />
              </div>
            ))}
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
          <SortableContext
            items={items.map((item) => item.item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={cn("flex h-full w-full flex-col gap-1.5", {})}>
              {items.map((item) => (
                <SortableItem
                  key={item.item.id}
                  id={item.item.id}
                  item={item.item}
                  blockType={item.variant}
                >
                  <RenderBlockItem
                    item={item}
                    isDraft={isDraft}
                    onUpdateDraft={onUpdateDraft}
                    onFocus={onFocus}
                    shouldFocus={shouldFocus}
                    onEnterPress={handleEnterPress}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
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
    </DndContext>
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
