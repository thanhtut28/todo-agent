import type { BlockWithContent } from "~/server/db/schema";
import CheckboxItem from "./checkbox";

interface Props {
  block: BlockWithContent;
}

export default function BlockItem({ block }: Props) {
  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="flex flex-col gap-2">
        {block.checkboxes.length > 0 &&
          block.checkboxes.map((checkbox) => (
            <CheckboxItem key={checkbox.id} checkbox={checkbox} />
          ))}
      </div>
    </div>
  );
}
