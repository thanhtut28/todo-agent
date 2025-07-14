import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, PenIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import type { BlockItemType, BlockItemVariantType } from "~/lib/types";
import EditorToolbox from "../editor/editor-toolbox";
import EditorDrawer from "../layout/editor-drawer";

interface SortableItemProps {
  id: number;
  children: React.ReactNode;
  item: BlockItemType;
  blockType: BlockItemVariantType;
}

export default function SortableItem({
  id,
  children,
  item,
  blockType,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const [isHovering, setIsHovering] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleOpenDrawerChange = (open: boolean) => {
    setOpenEditor(open);
    setIsHovering(false);
    if (!open) {
      setOpenEditor(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={style}
      className="flex w-fit items-center gap-3"
    >
      {/* Sortable handle */}
      <div
        className={cn("flex items-center gap-1", {
          "opacity-100": isHovering || isDragging,
          "opacity-0": !isHovering && !isDragging,
        })}
      >
        <div
          className={cn(
            "rounded-md p-1 hover:bg-gray-800 active:cursor-grabbing",
          )}
        >
          <EditorDrawer
            open={openEditor}
            onOpenChange={handleOpenDrawerChange}
            trigger={
              <PenIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            }
          >
            <EditorToolbox
              onClose={() => setOpenEditor(false)}
              blockType={blockType}
              item={item}
            />
          </EditorDrawer>
        </div>
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "rounded-md p-1 hover:bg-gray-800 active:cursor-grabbing",
          )}
        >
          <GripVerticalIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </div>
      </div>
      {children}
    </div>
  );
}
