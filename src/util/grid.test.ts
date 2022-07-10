import { expect } from '@open-wc/testing';
import { create2DGrid, create3DGrid, shape } from './grid';

describe('grid', () => {
  describe(shape.name, () => {
    it('should return shape correctly for 1-D array', () => {
      const testArray = [1, 2, 3];

      expect(shape(testArray)).eql([3]);
    });

    it('should return shape correctly for 2-D array', () => {
      const testArray = create2DGrid(
        {
          x: 2,
          y: 3,
        },
        1
      );

      expect(shape(testArray)).eql([2, 3]);
    });

    it('should return shape correctly for 3-D array', () => {
      const testArray = create3DGrid(
        {
          x: 2,
          y: 3,
          z: 4,
        },
        1
      );

      expect(shape(testArray)).eql([2, 3, 4]);
    });
  });
});
