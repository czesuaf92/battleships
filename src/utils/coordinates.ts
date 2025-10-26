/**
 * @file Funkcje pomocnicze do pracy z koordynatami na planszy
 */

import { BOARD_SIZE } from '../constants/game';

/**
 * Sprawdza czy pozycja (row, col) znajduje się w granicach planszy
 *
 * @param row - wiersz (0-9)
 * @param col - kolumna (0-9)
 * @returns true jeśli pozycja jest poprawna, false w przeciwnym przypadku
 *
 * @example
 * isPositionValid(5, 5) // true
 * isPositionValid(-1, 5) // false
 * isPositionValid(10, 5) // false
 */
export function isPositionValid(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}
