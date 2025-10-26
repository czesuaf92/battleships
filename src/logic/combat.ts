/**
 * @file Logika walki - strzały, trafienia, zatopienia
 */

import { Board, Ship, Position, CellStatus, ShotResult } from '../types';
import { getShipCells } from './ship-placement';

/**
 * Sprawdza czy okręt został zatopiony
 *
 * Okręt jest zatopiony gdy liczba trafień = długość okrętu
 *
 * @param ship - Okręt do sprawdzenia
 * @returns true jeśli okręt zatopiony, false w przeciwnym przypadku
 *
 * @example
 * const ship = { ..., length: 3, hits: 3 };
 * isShipSunk(ship); // true
 */
export function isShipSunk(ship: Ship): boolean {
  return ship.hits >= ship.length;
}

/**
 * Znajduje okręt po ID w tablicy okrętów
 *
 * @param ships - Tablica okrętów
 * @param shipId - ID okrętu do znalezienia
 * @returns Znaleziony okręt lub undefined
 *
 * @example
 * const ship = findShipById(ships, 'battleship-1');
 */
export function findShipById(ships: Ship[], shipId: string): Ship | undefined {
  return ships.find((ship) => ship.id === shipId);
}

/**
 * Pobiera wszystkie unikalne ID okrętów z planszy
 *
 * Uwzględnia tylko komórki ze statusem SHIP (nie HIT ani SUNK)
 *
 * @param board - Plansza do sprawdzenia
 * @returns Tablica unikalnych ID okrętów
 *
 * @example
 * const shipIds = getAllShipsFromBoard(board);
 * // => ['ship-1', 'ship-2', 'ship-3']
 */
export function getAllShipsFromBoard(board: Board): string[] {
  const shipIds = new Set<string>();

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];

      // Zbieramy tylko komórki z nieuszkodzonymi okrętami
      if (cell.status === CellStatus.SHIP && cell.shipId) {
        shipIds.add(cell.shipId);
      }
    }
  }

  return Array.from(shipIds);
}

/**
 * Oznacza wszystkie komórki okrętu jako zatopione
 *
 * @param board - Plansza (modyfikowana in-place)
 * @param ship - Zatopiony okręt
 */
function markShipAsSunk(board: Board, ship: Ship): void {
  const cells = getShipCells(ship.position, ship.length, ship.orientation);

  for (const cell of cells) {
    board[cell.row][cell.col].status = CellStatus.SUNK;
  }
}

/**
 * Przetwarza strzał gracza
 *
 * Wykonuje następujące akcje:
 * 1. Sprawdza czy strzał trafił w wodę (MISS)
 * 2. Jeśli trafił okręt - zwiększa licznik trafień
 * 3. Sprawdza czy okręt został zatopiony
 * 4. Aktualizuje status komórek na planszy
 *
 * @param board - Plansza (modyfikowana in-place)
 * @param position - Pozycja strzału
 * @param ships - Tablica okrętów (modyfikowana in-place)
 * @returns Wynik strzału (MISS, HIT, SUNK)
 *
 * @example
 * const result = processShot(board, { row: 5, col: 5 }, ships);
 * if (result === ShotResult.SUNK) {
 *   console.log('Zatopiony!');
 * }
 */
export function processShot(
  board: Board,
  position: Position,
  ships: Ship[]
): ShotResult {
  const { row, col } = position;
  const cell = board[row][col];

  // Jeśli już strzelaliśmy w to miejsce, zwracamy aktualny status
  if (cell.status === CellStatus.MISS) {
    return ShotResult.MISS;
  }

  if (cell.status === CellStatus.HIT || cell.status === CellStatus.SUNK) {
    return ShotResult.HIT;
  }

  // Pudło - strzał w wodę
  if (cell.status === CellStatus.EMPTY) {
    cell.status = CellStatus.MISS;
    return ShotResult.MISS;
  }

  // Trafienie w okręt!
  if (cell.status === CellStatus.SHIP) {
    cell.status = CellStatus.HIT;

    // Znajdź okręt który został trafiony
    const shipId = cell.shipId;
    if (!shipId) {
      // Nie powinno się zdarzyć, ale zabezpieczenie
      return ShotResult.HIT;
    }

    const ship = findShipById(ships, shipId);
    if (!ship) {
      // Nie powinno się zdarzyć
      return ShotResult.HIT;
    }

    // Zwiększ licznik trafień (tylko jeśli nie było już trafione)
    ship.hits++;

    // Sprawdź czy okręt został zatopiony
    if (isShipSunk(ship)) {
      ship.isSunk = true;
      markShipAsSunk(board, ship);
      return ShotResult.SUNK;
    }

    return ShotResult.HIT;
  }

  // Nie powinno się zdarzyć
  return ShotResult.MISS;
}
