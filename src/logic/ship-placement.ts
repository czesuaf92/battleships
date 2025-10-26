/**
 * @file Logika rozmieszczania okrętów na planszy
 */

import { Board, Position, Orientation, Ship, CellStatus } from '../types';
import { isPositionValid } from '../utils/coordinates';

/**
 * Zwraca listę wszystkich komórek zajmowanych przez okręt
 *
 * @param position - Pozycja startowa okrętu (lewy górny róg)
 * @param length - Długość okrętu
 * @param orientation - Orientacja (pozioma/pionowa)
 * @returns Tablica pozycji komórek okrętu
 *
 * @example
 * getShipCells({ row: 2, col: 3 }, 3, Orientation.HORIZONTAL)
 * // => [{ row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 5 }]
 */
export function getShipCells(
  position: Position,
  length: number,
  orientation: Orientation
): Position[] {
  const cells: Position[] = [];

  for (let i = 0; i < length; i++) {
    if (orientation === Orientation.HORIZONTAL) {
      cells.push({ row: position.row, col: position.col + i });
    } else {
      cells.push({ row: position.row + i, col: position.col });
    }
  }

  return cells;
}

/**
 * Sprawdza czy w danej pozycji lub wokół niej znajdują się okręty
 *
 * @param board - Plansza do sprawdzenia
 * @param position - Pozycja do sprawdzenia
 * @returns true jeśli w sąsiedztwie (włącznie z ukosami) są okręty
 *
 * @example
 * const board = createEmptyBoard();
 * board[5][5].status = CellStatus.SHIP;
 * hasAdjacentShips(board, { row: 5, col: 6 }); // true (bezpośrednio obok)
 * hasAdjacentShips(board, { row: 4, col: 4 }); // true (na ukos)
 * hasAdjacentShips(board, { row: 7, col: 7 }); // false (za daleko)
 */
export function hasAdjacentShips(board: Board, position: Position): boolean {
  const { row, col } = position;

  // Sprawdzamy wszystkie 8 kierunków wokół pozycji (włącznie z ukosami)
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // góra-lewo, góra, góra-prawo
    [0, -1],           [0, 1],    // lewo, prawo
    [1, -1],  [1, 0],  [1, 1],    // dół-lewo, dół, dół-prawo
  ];

  for (const [dr, dc] of directions) {
    const checkRow = row + dr;
    const checkCol = col + dc;

    // Sprawdzamy czy pozycja jest w granicach planszy
    if (isPositionValid(checkRow, checkCol)) {
      // Jeśli w tej pozycji jest okręt, zwracamy true
      if (board[checkRow][checkCol].status === CellStatus.SHIP) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Sprawdza czy okręt można umieścić w danej pozycji
 *
 * Waliduje:
 * 1. Czy okręt mieści się w granicach planszy
 * 2. Czy nie koliduje z istniejącymi okrętami
 * 3. Czy nie styka się z innymi okrętami (żadną częścią, nawet rogiem)
 *
 * @param board - Plansza do sprawdzenia
 * @param position - Pozycja startowa okrętu
 * @param length - Długość okrętu
 * @param orientation - Orientacja okrętu
 * @returns true jeśli okręt może być umieszczony, false w przeciwnym przypadku
 *
 * @example
 * const board = createEmptyBoard();
 * canPlaceShip(board, { row: 0, col: 0 }, 3, Orientation.HORIZONTAL); // true
 * canPlaceShip(board, { row: 0, col: 9 }, 3, Orientation.HORIZONTAL); // false (wychodzi poza planszę)
 */
export function canPlaceShip(
  board: Board,
  position: Position,
  length: number,
  orientation: Orientation
): boolean {
  const shipCells = getShipCells(position, length, orientation);

  // Sprawdzamy każdą komórkę okrętu
  for (const cell of shipCells) {
    // 1. Sprawdzamy czy komórka jest w granicach planszy
    if (!isPositionValid(cell.row, cell.col)) {
      return false;
    }

    // 2. Sprawdzamy czy komórka jest pusta (brak kolizji)
    if (board[cell.row][cell.col].status !== CellStatus.EMPTY) {
      return false;
    }

    // 3. Sprawdzamy czy w sąsiedztwie nie ma innych okrętów
    if (hasAdjacentShips(board, cell)) {
      return false;
    }
  }

  return true;
}

/**
 * Umieszcza okręt na planszy
 *
 * UWAGA: Funkcja nie sprawdza czy umieszczenie jest poprawne!
 * Użyj canPlaceShip() przed wywołaniem tej funkcji.
 *
 * @param board - Plansza (modyfikowana in-place)
 * @param ship - Okręt do umieszczenia
 *
 * @example
 * const board = createEmptyBoard();
 * const ship = {
 *   id: 'ship-1',
 *   type: ShipType.CRUISER,
 *   length: 2,
 *   position: { row: 5, col: 5 },
 *   orientation: Orientation.HORIZONTAL,
 *   hits: 0,
 *   isSunk: false
 * };
 *
 * if (canPlaceShip(board, ship.position, ship.length, ship.orientation)) {
 *   placeShip(board, ship);
 * }
 */
export function placeShip(board: Board, ship: Ship): void {
  const cells = getShipCells(ship.position, ship.length, ship.orientation);

  for (const cell of cells) {
    board[cell.row][cell.col].status = CellStatus.SHIP;
    board[cell.row][cell.col].shipId = ship.id;
  }
}
