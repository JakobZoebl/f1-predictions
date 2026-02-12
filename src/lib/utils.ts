import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a hex color string to HSL values.
 * Returns { h, s, l } object.
 * Handles #RRGGBB and #RGB formats.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  let r = 0, g = 0, b = 0;
  
  // Remove # if present
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return null;
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Calculates a deep, tinted background color based on a primary hex color.
 * Maintains a consistent "distance" from the primary color (S=25%, L=6%).
 */
export function getAdaptiveDeepBackground(hex: string, alpha: number = 1): string | null {
  const hsl = hexToHsl(hex);
  if (!hsl) return null;
  
  if (alpha === 1) {
    return `hsl(${hsl.h} 25% 6%)`;
  }
  return `hsl(${hsl.h} 25% 6% / ${alpha})`;
}
