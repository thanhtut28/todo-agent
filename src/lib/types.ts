import type {
  color as pgColorEnum,
  fontSize as pgFontSizeEnum,
  fontStyle as pgFontStyleEnum,
  fontWeight as pgFontWeightEnum,
  headingVariant as pgHeadingVariantEnum,
} from "~/server/db/schema";

export type HeadingVariantType =
  (typeof pgHeadingVariantEnum.enumValues)[number];
export type FontSizeType = (typeof pgFontSizeEnum.enumValues)[number];
export type FontWeightType = (typeof pgFontWeightEnum.enumValues)[number];
export type FontStyleType = (typeof pgFontStyleEnum.enumValues)[number];
export type ColorType = (typeof pgColorEnum.enumValues)[number];

export type CreateNewBlockType = "checkbox" | "list" | "placeholder";

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
