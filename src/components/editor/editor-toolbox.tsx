import type { Heading as HeadingType } from "~/server/db/schema";
import type { Checkbox as CheckboxType } from "~/server/db/schema";
import TypographyEditor from "./typography-editor";
import PreviewItem from "./preview-item";
import { useEffect, useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import EditorAction from "./editor-action";
import { updateBlockItem } from "~/server/db/actions";
import ColorEditor from "./color-editor";
import { ScrollArea } from "../ui/scroll-area";
import VariantConfigEditor from "./variant-config-editor";
import type { BlockItemType, BlockItemVariantType } from "~/lib/types";

export default function EditorToolbox({
  blockType,
  item,
  onClose,
}: {
  blockType: BlockItemVariantType;
  item: BlockItemType;
  onClose: () => void;
}) {
  const [blockItem, setBlockItem] = useState(item);
  const [fontSize, setFontSize] = useState(item.fontSize);
  const [fontWeight, setFontWeight] = useState(item.fontWeight);
  const [fontStyle, setFontStyle] = useState(item.fontStyle);
  const [color, setColor] = useState(item.color);
  const [bgColor, setBgColor] = useState(item.bgColor);
  const [text, setText] = useState(item.text);
  const [variant, setVariant] = useState(
    (item as HeadingType | undefined)?.variant ?? "h4",
  );
  const [checked, setChecked] = useState(
    (item as CheckboxType | undefined)?.checked ?? false,
  );
  const [itemType, setItemType] = useState<BlockItemVariantType>(blockType);

  const previewItem = useMemo(
    () => ({
      ...blockItem,
      fontSize,
      fontWeight,
      fontStyle,
      color,
      bgColor,
      text,
      ...(itemType === "heading" && { variant }),
      ...(itemType === "checkbox" && { checked }),
    }),
    [
      blockItem,
      fontSize,
      fontWeight,
      fontStyle,
      color,
      bgColor,
      text,
      variant,
      checked,
      itemType,
    ],
  );

  const isNothingChanged = useMemo(() => {
    return (
      fontSize === item.fontSize &&
      fontWeight === item.fontWeight &&
      fontStyle === item.fontStyle &&
      color === item.color &&
      bgColor === item.bgColor &&
      text === item.text &&
      variant === ((item as HeadingType | undefined)?.variant ?? "h4") &&
      checked === ((item as CheckboxType | undefined)?.checked ?? false) &&
      itemType === blockType
    );
  }, [
    fontSize,
    fontWeight,
    fontStyle,
    color,
    bgColor,
    text,
    item,
    variant,
    checked,
    itemType,
    blockType,
  ]);

  const handleSaveChanges = async () => {
    if (isNothingChanged) return;

    const { success, message } = await updateBlockItem(
      item.id,
      previewItem,
      blockType,
      itemType,
    );
    if (success) {
      onClose();
    }
  };

  const handleUpdateItem = (item: BlockItemType) => {
    switch (itemType) {
      case "heading":
        setVariant((item as HeadingType).variant);
        break;
      case "checkbox":
        setChecked((item as CheckboxType).checked);
        break;
    }
  };

  const handleCancelEdit = () => {
    onClose();
  };

  useEffect(() => {
    const omitConfigKeys = ["checked", "variant", "listType"];
    const itemKeys = Object.keys(item).filter(
      (key) => !omitConfigKeys.includes(key),
    );
    const newItem = itemKeys.reduce(
      (acc, key) => {
        acc[key] = item[key as keyof typeof item];
        return acc;
      },
      {} as Record<string, any>,
    );
    setBlockItem(newItem as unknown as BlockItemType);
  }, [item, itemType]);

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden">
        <PreviewItem item={previewItem} variant={itemType} />
        <Separator />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex h-full flex-1 flex-col justify-between">
            <ScrollArea className="h-full flex-1">
              <div className="space-y-8">
                <VariantConfigEditor
                  itemType={itemType}
                  onUpdateItemType={setItemType}
                  headingVariant={variant}
                  checked={checked}
                  item={item}
                  onUpdateItem={handleUpdateItem}
                />
                <Separator />
                <TypographyEditor
                  text={text}
                  onUpdateText={setText}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  fontStyle={fontStyle}
                  onUpdateFontSize={setFontSize}
                  onUpdateFontWeight={setFontWeight}
                  onUpdateFontStyle={setFontStyle}
                />
                <Separator />
                <ColorEditor
                  color={color}
                  bgColor={bgColor}
                  onUpdateColor={setColor}
                  onUpdateBgColor={setBgColor}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Separator />
        <EditorAction
          isSaveBtnDisabled={isNothingChanged}
          onSave={handleSaveChanges}
          onCancel={handleCancelEdit}
        />
      </div>
    </div>
  );
}
