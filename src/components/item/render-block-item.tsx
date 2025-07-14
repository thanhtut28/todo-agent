import HeadingItem from "./heading";
import CheckboxItem from "./checkbox";
import ParagraphItem from "./paragraph";
import ListItem from "./list";
import type {
  BlockWithContent,
  Checkbox as CheckboxType,
  Heading as HeadingType,
  ListItem as ListItemType,
  Paragraph as ParagraphType,
} from "~/server/db/schema";
import type {
  BlockItemType,
  BlockItemVariantType,
  CreateNewBlockType,
} from "~/lib/types";
import type { FlattenBlockItem } from "~/lib/utils";

interface Props {
  item: FlattenBlockItem;
  isDraft?: boolean;
  onUpdateDraft?: React.Dispatch<React.SetStateAction<BlockWithContent | null>>;
  onFocus?: (id: number) => void;
  shouldFocus?: boolean;
  onEnterPress?: (type: CreateNewBlockType, displayOrder: number) => void;
  isPreview?: boolean;
}

export default function RenderBlockItem({
  item,
  isDraft,
  onUpdateDraft,
  onFocus,
  shouldFocus,
  onEnterPress,
  isPreview = false,
}: Props) {
  function renderBlockItem(item: {
    variant: BlockItemVariantType;
    item: BlockItemType;
  }) {
    switch (item.variant) {
      case "heading":
        return (
          <HeadingItem
            key={item.item.id}
            heading={item.item as HeadingType}
            onEnterPress={onEnterPress}
            onFocus={() => onFocus?.(item.item.id)}
            shouldFocus={shouldFocus}
            isDraft={isDraft}
            isPreview={isPreview}
          />
        );
      case "checkbox":
        return (
          <CheckboxItem
            key={item.item.id}
            isDraft={isDraft}
            onUpdateDraft={onUpdateDraft}
            checkbox={item.item as CheckboxType}
            onEnterPress={onEnterPress}
            onFocus={() => onFocus?.(item.item.id)}
            shouldFocus={shouldFocus}
            isPreview={isPreview}
          />
        );
      case "paragraph":
        return (
          <ParagraphItem
            onEnterPress={onEnterPress}
            onFocus={() => onFocus?.(item.item.id)}
            shouldFocus={shouldFocus}
            onUpdateDraft={onUpdateDraft}
            isDraft={isDraft}
            key={item.item.id}
            paragraph={item.item as ParagraphType}
            isPreview={isPreview}
          />
        );
      case "list":
        return (
          <ListItem
            listItem={item.item as ListItemType}
            onEnterPress={onEnterPress}
            shouldFocus={shouldFocus}
            isDraft={isDraft}
            onFocus={() => onFocus?.(item.item.id)}
            onUpdateDraft={onUpdateDraft}
            key={item.item.id}
            isPreview={isPreview}
          />
        );
      default:
        return null;
    }
  }

  return renderBlockItem(item);
}
