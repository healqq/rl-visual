export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export const RGBColorToString = (rgbColor: RGBColor) =>
  `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;

const linearScale = (start: number, end: number, point: number) =>
  start + (end - start) * point;

export class ColorScale {
  constructor(private startColor: RGBColor, private endColor: RGBColor) {}

  getAt(value: number) {
    if (value < 0) {
      return this.startColor;
    }

    if (value > 1) {
      return this.endColor;
    }

    return {
      r: Math.floor(linearScale(this.startColor.r, this.endColor.r, value)),
      g: Math.floor(linearScale(this.startColor.g, this.endColor.g, value)),
      b: Math.floor(linearScale(this.startColor.b, this.endColor.b, value)),
    };
  }
}
