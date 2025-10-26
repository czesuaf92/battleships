/**
 * @file Testy dla funkcji pomocniczych związanych z koordynatami
 * To jest nasz pierwszy test - TDD w akcji!
 */

import { isPositionValid } from '../../utils/coordinates';

describe('coordinates utils', () => {
  describe('isPositionValid', () => {
    it('should return true for valid position inside board (0,0)', () => {
      expect(isPositionValid(0, 0)).toBe(true);
    });

    it('should return true for valid position inside board (5,5)', () => {
      expect(isPositionValid(5, 5)).toBe(true);
    });

    it('should return true for valid position at board edge (9,9)', () => {
      expect(isPositionValid(9, 9)).toBe(true);
    });

    it('should return false for negative row', () => {
      expect(isPositionValid(-1, 5)).toBe(false);
    });

    it('should return false for negative column', () => {
      expect(isPositionValid(5, -1)).toBe(false);
    });

    it('should return false for row >= 10', () => {
      expect(isPositionValid(10, 5)).toBe(false);
    });

    it('should return false for column >= 10', () => {
      expect(isPositionValid(5, 10)).toBe(false);
    });

    it('should return false for both coordinates out of bounds', () => {
      expect(isPositionValid(-1, 15)).toBe(false);
    });
  });
});
