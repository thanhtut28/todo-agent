import type {
  BlockItemType,
  BlockItemVariantType,
  HeadingVariantType,
} from "~/lib/types";
import {
  headingVariant as pgHeadingVariantEnum,
  type Heading as HeadingType,
  type Checkbox as CheckboxType,
  blockItemVariant as pgBlockItemVariantEnum,
} from "~/server/db/schema";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Switch } from "../ui/switch";
import { Check, Heading, Link, List, Pilcrow } from "lucide-react";

interface Props<T extends BlockItemType, V extends BlockItemVariantType> {
  itemType: V;
  item: T;
  headingVariant: HeadingVariantType;
  checked: boolean;
  onUpdateItem: (item: T) => void;
  onUpdateItemType: (itemType: V) => void;
}

export default function VariantConfigEditor<
  T extends BlockItemType,
  V extends BlockItemVariantType,
>({
  itemType,
  item,
  headingVariant,
  checked,
  onUpdateItem,
  onUpdateItemType,
}: Props<T, V>) {
  return (
    <div className="space-y-4">
      <h5 className="text-card-foreground text-sm font-medium">Config</h5>
      {/* TODO: Not working as expected, needs to be fixed later */}
      <BlockTypeEditor
        itemType={itemType}
        onChangeItemType={onUpdateItemType}
      />
      {itemType === "heading" && (
        <HeadingVariantEditor
          variant={headingVariant}
          onChangeVariant={(variant) => {
            onUpdateItem({
              ...item,
              variant,
            });
          }}
        />
      )}
      {itemType === "checkbox" && (
        <CheckboxVariantEditor
          checked={checked}
          onChangeChecked={(checked) => {
            onUpdateItem({
              ...item,
              checked,
            });
          }}
        />
      )}
    </div>
  );
}

const BlockTypeEditor = <V extends BlockItemVariantType>({
  itemType,
  onChangeItemType,
}: {
  itemType: V;
  onChangeItemType: (itemType: V) => void;
}) => {
  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">Block Type</h6>
      <ToggleGroup
        value={itemType}
        defaultValue={itemType}
        onValueChange={(value) => {
          if (value === "") {
            return;
          }
          onChangeItemType(value as V);
        }}
        type="single"
        variant="outline"
      >
        <ToggleGroupItem value={"heading" as V}>
          <Heading className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value={"checkbox" as V}>
          <Check className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value={"paragraph" as V}>
          <Pilcrow className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value={"list" as V}>
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value={"link" as V}>
          <Link className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

const HeadingVariantEditor = ({
  variant,
  onChangeVariant,
}: {
  variant: HeadingVariantType;
  onChangeVariant: (variant: HeadingVariantType) => void;
}) => {
  const headingVariantValues = pgHeadingVariantEnum.enumValues;
  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">
        Heading Variant
      </h6>
      <ToggleGroup
        value={variant}
        defaultValue={variant}
        onValueChange={(value) => {
          if (value === "") {
            return;
          }
          onChangeVariant(value as HeadingVariantType);
        }}
        type="single"
        variant="outline"
      >
        {headingVariantValues.map((value) => (
          <ToggleGroupItem key={value} value={value}>
            <span className="text-xs font-medium">{value}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

const CheckboxVariantEditor = ({
  checked,
  onChangeChecked,
}: {
  checked: boolean;
  onChangeChecked: (checked: boolean) => void;
}) => {
  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">Checked</h6>
      <Switch
        checked={checked}
        onCheckedChange={onChangeChecked}
        // className="data-[state=on]:bg-primary"
      />
    </div>
  );
};
