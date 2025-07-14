import type {
  color as pgColorEnum,
  fontSize as pgFontSizeEnum,
  fontStyle as pgFontStyleEnum,
  fontWeight as pgFontWeightEnum,
  headingVariant as pgHeadingVariantEnum,
  blockItemVariant as pgBlockItemVariantEnum,
} from "~/server/db/schema";
import type {
  Heading as HeadingType,
  Checkbox as CheckboxType,
  Paragraph as ParagraphType,
  ListItem as ListItemType,
  Link as LinkType,
} from "~/server/db/schema";

export type HeadingVariantType =
  (typeof pgHeadingVariantEnum.enumValues)[number];
export type FontSizeType = (typeof pgFontSizeEnum.enumValues)[number];
export type FontWeightType = (typeof pgFontWeightEnum.enumValues)[number];
export type FontStyleType = (typeof pgFontStyleEnum.enumValues)[number];
export type ColorType = (typeof pgColorEnum.enumValues)[number];
export type BlockItemVariantType =
  (typeof pgBlockItemVariantEnum.enumValues)[number];

export type CreateNewBlockType = BlockItemVariantType | "placeholder";

export type BlockItemType =
  | HeadingType
  | CheckboxType
  | ParagraphType
  | ListItemType
  | LinkType;

export const twFontSize: Record<FontSizeType, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
};

export const twFontWeight: Record<FontWeightType, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const twFontStyle: Record<FontStyleType, string> = {
  italic: "italic",
  normal: "normal",
  oblique: "oblique",
};

export const twColor: Record<ColorType, string> = {
  red: "text-red-500",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  green: "text-green-500",
  blue: "text-blue-500",
  white: "text-white",
  black: "text-black",
  gray: "text-gray-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  brown: "text-brown-500",
  cyan: "text-cyan-500",
  teal: "text-teal-500",
  transparent: "text-transparent",
};

export const twBgColor: Record<ColorType, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  white: "bg-white",
  black: "bg-black",
  gray: "bg-gray-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  brown: "bg-brown-500",
  cyan: "bg-cyan-500",
  teal: "bg-teal-500",
  transparent: "bg-transparent",
};

export enum HeadingVariantEnum {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6",
}

export enum FontSizeEnum {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
  "2xl" = "2xl",
  "3xl" = "3xl",
  "4xl" = "4xl",
  "5xl" = "5xl",
  "6xl" = "6xl",
}

export enum FontWeightEnum {
  thin = "thin",
  extralight = "extralight",
  light = "light",
  normal = "normal",
  medium = "medium",
  semibold = "semibold",
  bold = "bold",
}

export enum ColorEnum {
  red = "red",
  orange = "orange",
  yellow = "yellow",
  green = "green",
  blue = "blue",
  white = "white",
  black = "black",
  gray = "gray",
  purple = "purple",
  pink = "pink",
  brown = "brown",
  cyan = "cyan",
  teal = "teal",
  transparent = "transparent",
}

export enum ListTypeEnum {
  ordered = "ordered",
  unordered = "unordered",
  numbered = "numbered",
}

export enum FontStyleEnum {
  italic = "italic",
  normal = "normal",
  oblique = "oblique",
}
