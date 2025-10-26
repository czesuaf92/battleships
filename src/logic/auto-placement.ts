/**
 * @file Automatyczne losowe rozstawianie okrętów
 *
 * TEMPORARY SOLUTION - Docelowo gracz będzie rozstawiał okręty ręcznie
 * w fazie SETUP. Ta funkcja służy tymczasowo do szybkiego testowania gry.
 */

import { Board, Ship, Orientation } from '../types';
import { canPlaceShip, placeShip } from './ship-placement';
import { BOARD_SIZE } from '../constants/game';

/**
 * Automatycznie rozmieszcza wszystkie okręty losowo na planszy
 *
 * ⚠️ TEMPORARY - Do usunięcia gdy będzie UI do ręcznego rozstawiania
 *
 * Próbuje znaleźć losowe pozycje dla wszystkich okrętów.
 * Okręty są sortowane od największych do najmniejszych dla lepszego rozstawienia.
 * Jeśli nie uda się rozstawić w 1000 próbach, rzuca błąd.
 *
 * @param board - Plansza do rozstawienia okrętów (modyfikowana in-place)
 * @param ships - Tablica okrętów do rozstawienia (modyfikowana in-place)
 * @throws Error jeśli nie udało się rozstawić okrętów
 *
 * @example
 * const board = createEmptyBoard();
 * const ships = createFleet();
 * autoPlaceShips(board, ships);
 * // Wszystkie okręty są teraz rozstawione na planszy
 */
export function autoPlaceShips(board: Board, ships: Ship[]): void {
  // Sortuj okręty od największych do najmniejszych (łatwiej je rozstawić)
  const sortedShips = [...ships].sort((a, b) => b.length - a.length);

  for (const ship of sortedShips) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 1000;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      // Losowa pozycja
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);

      // Losowa orientacja
      const orientation =
        Math.random() < 0.5 ? Orientation.HORIZONTAL : Orientation.VERTICAL;

      // Sprawdź czy można umieścić
      if (canPlaceShip(board, { row, col }, ship.length, orientation)) {
        // Ustaw pozycję i orientację
        ship.position = { row, col };
        ship.orientation = orientation;

        // Umieść okręt na planszy
        placeShip(board, ship);
        placed = true;
      }
    }

    if (!placed) {
      throw new Error(
        `Failed to place ship ${ship.id} after ${maxAttempts} attempts. This should not happen.`
      );
    }
  }
}
