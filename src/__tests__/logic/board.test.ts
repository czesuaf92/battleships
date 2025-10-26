/**
 * @file Testy dla logiki planszy
 * TDD: Testy napisane PRZED implementacją!
 */

import { createEmptyBoard, isCellEmpty } from '../../logic/board';
import { CellStatus, Board } from '../../types';
import { BOARD_SIZE } from '../../constants/game';

describe('Board Logic', () => {
  describe('createEmptyBoard', () => {
    it('should create a 10x10 board', () => {
      const board = createEmptyBoard();

      expect(board.length).toBe(BOARD_SIZE);
      expect(board[0].length).toBe(BOARD_SIZE);
    });

    it('should initialize all cells with EMPTY status', () => {
      const board = createEmptyBoard();

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          expect(board[row][col].status).toBe(CellStatus.EMPTY);
          expect(board[row][col].position).toEqual({ row, col });
          expect(board[row][col].shipId).toBeUndefined();
        }
      }
    });

    it('should create a new board instance each time', () => {
      const board1 = createEmptyBoard();
      const board2 = createEmptyBoard();

      expect(board1).not.toBe(board2);
      expect(board1[0]).not.toBe(board2[0]);
    });
  });

  describe('isCellEmpty', () => {
    let board: Board;

    beforeEach(() => {
      board = createEmptyBoard();
    });

    it('should return true for empty cell', () => {
      expect(isCellEmpty(board, { row: 0, col: 0 })).toBe(true);
      expect(isCellEmpty(board, { row: 5, col: 5 })).toBe(true);
      expect(isCellEmpty(board, { row: 9, col: 9 })).toBe(true);
    });

    it('should return false for cell with ship', () => {
      board[3][4].status = CellStatus.SHIP;

      expect(isCellEmpty(board, { row: 3, col: 4 })).toBe(false);
    });

    it('should return false for cell with hit', () => {
      board[2][2].status = CellStatus.HIT;

      expect(isCellEmpty(board, { row: 2, col: 2 })).toBe(false);
    });

    it('should return false for invalid position', () => {
      expect(isCellEmpty(board, { row: -1, col: 5 })).toBe(false);
      expect(isCellEmpty(board, { row: 10, col: 5 })).toBe(false);
      expect(isCellEmpty(board, { row: 5, col: -1 })).toBe(false);
      expect(isCellEmpty(board, { row: 5, col: 10 })).toBe(false);
    });
  });
});
