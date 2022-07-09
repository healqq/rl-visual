import { RGBColor } from './types';
import { linearScale } from './util';

export class ColorScale {
  constructor(private startColor: RGBColor, private endColor: RGBColor) {}

  getAt(value: number): RGBColor {
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
