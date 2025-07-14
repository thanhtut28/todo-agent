import type { BlockItemVariantType, BlockItemType } from "~/lib/types";
import RenderBlockItem from "../item/render-block-item";

export default function PreviewItem({
  item,
  variant,
}: {
  item: BlockItemType;
  variant: BlockItemVariantType;
}) {
  return (
    <div className="relative space-y-2 rounded-md border border-gray-600 px-1 py-6">
      <span className="absolute -bottom-4 left-2 rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        Preview
      </span>
      <RenderBlockItem isPreview item={{ item, variant }} />
    </div>
  );
}
