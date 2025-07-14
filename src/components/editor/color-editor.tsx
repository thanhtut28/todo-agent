import { twBgColor, twColor, type ColorType } from "~/lib/types";
import { color as pgColorEnum } from "~/server/db/schema";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Type, TypeOutline } from "lucide-react";
import { cn } from "~/lib/utils";
import { Separator } from "../ui/separator";
import { getContrastingTextClass } from "./util";

interface Props {
  color?: ColorType;
  bgColor?: ColorType;
  onUpdateColor: (color: ColorType) => void;
  onUpdateBgColor: (bgColor: ColorType) => void;
}

export default function ColorEditor({
  color = "white",
  bgColor = "transparent",
  onUpdateColor,
  onUpdateBgColor,
}: Props) {
  return (
    <div className="space-y-4">
      <h5 className="text-card-foreground text-sm font-medium">Color</h5>
      <div className="space-y-4">
        <ColorToggleGroup color={color} onChangeColor={onUpdateColor} />
        <BgColorToggleGroup
          bgColor={bgColor}
          onChangeBgColor={onUpdateBgColor}
        />
      </div>
    </div>
  );
}

const ColorToggleGroup = ({
  color,
  onChangeColor,
}: {
  color: ColorType;
  onChangeColor: (color: ColorType) => void;
}) => {
  const colorValues = pgColorEnum.enumValues;

  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">Text Color</h6>
      <ToggleGroup
        value={color}
        defaultValue={color}
        onValueChange={(value) => {
          if (value === "") {
            return;
          }
          onChangeColor(value as ColorType);
        }}
        type="single"
        variant="outline"
      >
        {colorValues.map((value) => (
          <ToggleGroupItem
            size="lg"
            key={value}
            value={value}
            aria-label={`Toggle ${value} text color`}
            className={color === value ? "bg-gray-500" : ""}
          >
            <TypeOutline className={cn("h-4 w-4", twColor[value])} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

const BgColorToggleGroup = ({
  bgColor,
  onChangeBgColor,
}: {
  bgColor: ColorType;
  onChangeBgColor: (bgColor: ColorType) => void;
}) => {
  const bgColorValues = pgColorEnum.enumValues;

  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">
        Background Color
      </h6>
      <ToggleGroup
        size="lg"
        value={bgColor}
        defaultValue={bgColor}
        onValueChange={(value) => {
          if (value === "") {
            return;
          }
          onChangeBgColor(value as ColorType);
        }}
        type="single"
        variant="outline"
      >
        {bgColorValues.map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={`Toggle ${value} background color`}
          >
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-md",
                twBgColor[value],
              )}
            >
              <Type className={cn("h-4 w-4", getContrastingTextClass(value))} />
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
