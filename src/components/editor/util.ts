import { twBgColor, type ColorType } from "~/lib/types";

// RGB values for Tailwind color palette (500 variants)
const tailwindColorRgb: Record<string, [number, number, number]> = {
  "bg-red-500": [239, 68, 68],
  "bg-orange-500": [249, 115, 22],
  "bg-yellow-500": [234, 179, 8],
  "bg-green-500": [34, 197, 94],
  "bg-blue-500": [59, 130, 246],
  "bg-white": [255, 255, 255],
  "bg-black": [0, 0, 0],
  "bg-gray-500": [107, 114, 128],
  "bg-purple-500": [168, 85, 247],
  "bg-pink-500": [236, 72, 153],
  "bg-brown-500": [120, 63, 4], // Using amber-800 as brown equivalent
  "bg-cyan-500": [6, 182, 212],
  "bg-teal-500": [20, 184, 166],
  "bg-transparent": [255, 255, 255], // Default to white for transparent
};

/**
 * Calculates relative luminance of a color according to WCAG guidelines
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  // Convert RGB to relative values (0-1)
  const srgbValues = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance
  return (
    0.2126 * srgbValues[0]! + 0.7152 * srgbValues[1]! + 0.0722 * srgbValues[2]!
  );
}

/**
 * Calculates contrast ratio between two colors
 */
function getContrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determines if text should be white or black based on background color contrast
 * @param bgColorClass - Tailwind background color class (e.g., "bg-red-500")
 * @returns "white" or "black" for optimal contrast
 */
export function getContrastingTextColor(bgColor: ColorType): "white" | "black" {
  const rgb = tailwindColorRgb[twBgColor[bgColor]];

  if (!rgb) {
    console.warn(
      `Unknown background color: ${bgColor}, defaulting to black text`,
    );
    return "black";
  }

  const [r, g, b] = rgb;
  const bgLuminance = getRelativeLuminance(r, g, b);

  // Calculate contrast ratios for white and black text
  const whiteLuminance = 1; // White has luminance of 1
  const blackLuminance = 0; // Black has luminance of 0

  const whiteContrast = getContrastRatio(bgLuminance, whiteLuminance);
  const blackContrast = getContrastRatio(bgLuminance, blackLuminance);

  // Return the color with better contrast ratio
  return whiteContrast > blackContrast ? "white" : "black";
}

/**
 * Gets contrasting text color for a ColorType and returns Tailwind class
 * @param bgColor - ColorType from your enum
 * @returns Tailwind text color class
 */
export function getContrastingTextClass(bgColor: ColorType): string {
  const textColor = getContrastingTextColor(bgColor);
  return textColor === "white" ? "text-white" : "text-black";
}
