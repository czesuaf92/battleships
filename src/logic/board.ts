/**
 * @file Logika zarządzania planszą
 */

import { Board, Cell, CellStatus, Position } from '../types';
import { BOARD_SIZE } from '../constants/game';
import { isPositionValid } from '../utils/coordinates';

/**
 * Tworzy pustą planszę 10x10
 *
 * @returns Pusta plansza z wszystkimi komórkami w stanie EMPTY
 *
 * @example
 * const board = createEmptyBoard();
 * console.log(board.length); // 10
 * console.log(board[0][0].status); // CellStatus.EMPTY
 */
export function createEmptyBoard(): Board {
  const board: Board = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    const boardRow: Cell[] = [];

    for (let col = 0; col < BOARD_SIZE; col++) {
      boardRow.push({
        position: { row, col },
        status: CellStatus.EMPTY,
        shipId: undefined,
      });
    }

    board.push(boardRow);
  }

  return board;
}

/**
 * Sprawdza czy komórka jest pusta (bez okrętu)
 *
 * @param board - Plansza do sprawdzenia
 * @param position - Pozycja komórki
 * @returns true jeśli komórka jest pusta, false w przeciwnym przypadku
 *
 * @example
 * const board = createEmptyBoard();
 * isCellEmpty(board, { row: 0, col: 0 }); // true
 *
 * board[0][0].status = CellStatus.SHIP;
 * isCellEmpty(board, { row: 0, col: 0 }); // false
 */
export function isCellEmpty(board: Board, position: Position): boolean {
  // Sprawdzamy czy pozycja jest w granicach planszy
  if (!isPositionValid(position.row, position.col)) {
    return false;
  }

  // Komórka jest pusta tylko gdy ma status EMPTY
  return board[position.row][position.col].status === CellStatus.EMPTY;
}
