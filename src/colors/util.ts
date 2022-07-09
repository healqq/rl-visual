import { RGBColor } from './types';

export const RGBColorToString = (rgbColor: RGBColor): string =>
  `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;

export const linearScale = (
  start: number,
  end: number,
  point: number
): number => start + (end - start) * point;
