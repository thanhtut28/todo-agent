import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";

interface SortableItemProps {
  id: number;
  children: React.ReactNode;
}

export default function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3">
      {/* Sortable handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab rounded-md p-1 hover:bg-gray-800 active:cursor-grabbing"
      >
        <GripVerticalIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </div>
      {children}
    </div>
  );
}
