import type { FontSizeType, FontStyleType, FontWeightType } from "~/lib/types";
import {
  fontSize as pgFontSizeEnum,
  fontStyle as pgFontStyleEnum,
  fontWeight as pgFontWeightEnum,
} from "~/server/db/schema";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Input } from "../ui/input";

interface Props {
  text: string;
  fontSize?: FontSizeType;
  fontWeight?: FontWeightType;
  fontStyle?: FontStyleType;
  onUpdateText: (text: string) => void;
  onUpdateFontSize: (fontSize: FontSizeType) => void;
  onUpdateFontWeight: (fontWeight: FontWeightType) => void;
  onUpdateFontStyle: (fontStyle: FontStyleType) => void;
}

export default function TypographyEditor({
  fontSize = "md",
  fontWeight = "normal",
  fontStyle = "normal",
  onUpdateFontSize,
  onUpdateFontWeight,
  onUpdateFontStyle,
  text = "",
  onUpdateText,
}: Props) {
  return (
    <div className="space-y-4">
      <h5 className="text-card-foreground text-sm font-medium">Typography</h5>
      <div className="space-y-4">
        <TextEditor text={text} onUpdateText={onUpdateText} />
        <FontWeightToggleGroup
          fontWeight={fontWeight}
          onChangeFontWeight={onUpdateFontWeight}
        />
        <FontSizeToggleGroup
          fontSize={fontSize}
          onChangeFontSize={onUpdateFontSize}
        />
        <FontStyleToggleGroup
          fontStyle={fontStyle}
          onChangeFontStyle={onUpdateFontStyle}
        />
      </div>
    </div>
  );
}

const FontStyleToggleGroup = ({
  fontStyle,
  onChangeFontStyle,
}: {
  fontStyle: FontStyleType;
  onChangeFontStyle: (fontStyle: FontStyleType) => void;
}) => {
  const fontStyleValues = pgFontStyleEnum.enumValues;

  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">Font Style</h6>
      <ToggleGroup
        size="lg"
        value={fontStyle}
        defaultValue={fontStyle}
        onValueChange={(value) => {
          if (value === "") {
            return;
          }
          onChangeFontStyle(value as FontStyleType);
        }}
        type="single"
        variant="outline"
      >
        {fontStyleValues.map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={`Toggle ${value} font style`}
            className={fontStyle === value ? "bg-gray-500" : ""}
          >
            <span className="text-xs font-medium">{value}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

const TextEditor = ({
  text,
  onUpdateText,
}: {
  text: string;
  onUpdateText: (text: string) => void;
}) => {
  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">Text</h6>
      <Input
        value={text}
        onChange={(e) => onUpdateText(e.target.value)}
        className="w-full border-none bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

const FontSizeToggleGroup = ({
  fontSize,
  onChangeFontSize,
}: {
  fontSize: FontSizeType;
  onChangeFontSize: (fontSize: FontSizeType) => void;
}) => {
  const fontSizeValues = pgFontSizeEnum.enumValues;

  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">Font Size</h6>
      <ToggleGroup
        size="lg"
        value={fontSize}
        defaultValue={fontSize}
        onValueChange={(value) => {
          if (value === "") {
            return;
          }
          onChangeFontSize(value as FontSizeType);
        }}
        type="single"
        variant="outline"
      >
        {fontSizeValues.map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={`Toggle ${value} font size`}
            className={fontSize === value ? "bg-gray-500" : ""}
          >
            <span className="text-xs font-medium">{value}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

const FontWeightToggleGroup = ({
  fontWeight,
  onChangeFontWeight,
}: {
  fontWeight: FontWeightType;
  onChangeFontWeight: (fontWeight: FontWeightType) => void;
}) => {
  const fontWeightValues = pgFontWeightEnum.enumValues;

  return (
    <div className="space-y-1.5">
      <h6 className="text-muted-foreground text-xs font-medium">Font Weight</h6>
      <ToggleGroup
        size="lg"
        value={fontWeight}
        defaultValue={fontWeight}
        onValueChange={(value) => {
          if (value === "") {
            return;
          }
          onChangeFontWeight(value as FontWeightType);
        }}
        type="single"
        variant="outline"
      >
        {fontWeightValues.map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={`Toggle ${value} font weight`}
            className={fontWeight === value ? "bg-gray-500" : ""}
          >
            <span className="text-xs font-medium">{value}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
