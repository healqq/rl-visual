import { expect } from '@open-wc/testing';
import { ColorScale } from './ColorScale.js';

describe('ColorScale', () => {
  let instance: ColorScale;

  beforeEach(() => {
    instance = new ColorScale(
      {
        r: 0,
        g: 50,
        b: 100,
      },
      {
        r: 255,
        g: 205,
        b: 155,
      }
    );
  });

  it('should calculate value correctly', () => {
    expect(instance.getAt(0)).eql({ r: 0, g: 50, b: 100 });
    expect(instance.getAt(1)).eql({ r: 255, g: 205, b: 155 });

    expect(instance.getAt(0.25)).eql({ r: 63, g: 88, b: 113 });
    expect(instance.getAt(0.5)).eql({ r: 127, g: 127, b: 127 });
    expect(instance.getAt(0.75)).eql({ r: 191, g: 166, b: 141 });
  });
});
