/**
 * @file AI opponent logic with smart targeting
 */

import { Board, Position, CellStatus } from '../types';
import { BOARD_SIZE } from '../constants/game';

/**
 * Stan AI - przechowuje informacje o strategii strzelania
 */
export interface AIState {
  mode: 'hunt' | 'target'; // hunt = losowe strzały, target = celowanie w trafiony okręt
  targetQueue: Position[]; // Kolejka komórek do ostrzelania (sąsiedzi trafień)
  lastHit: Position | null; // Ostatnie trafienie
  hits: Position[]; // Historia wszystkich trafień (do analizy kierunku)
}

/**
 * Tworzy początkowy stan AI
 */
export function createAIState(): AIState {
  return {
    mode: 'hunt',
    targetQueue: [],
    lastHit: null,
    hits: [],
  };
}

/**
 * Zwraca sąsiednie komórki (góra, dół, lewo, prawo) - bez ukosów
 */
function getAdjacentCells(position: Position): Position[] {
  const { row, col } = position;
  const adjacent: Position[] = [];

  // Góra, dół, lewo, prawo (NIE ukośnie)
  const directions = [
    { row: row - 1, col }, // góra
    { row: row + 1, col }, // dół
    { row, col: col - 1 }, // lewo
    { row, col: col + 1 }, // prawo
  ];

  for (const pos of directions) {
    if (pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE) {
      adjacent.push(pos);
    }
  }

  return adjacent;
}

/**
 * Sprawdza czy dana pozycja jest dostępna do ostrzelania
 */
function isCellAvailable(board: Board, position: Position): boolean {
  const cell = board[position.row][position.col];
  return cell.status === CellStatus.EMPTY || cell.status === CellStatus.SHIP;
}

/**
 * Oblicza najlepszy strzał dla AI
 *
 * Algorytm:
 * 1. MODE: TARGET (po trafieniu)
 *    - Jeśli mamy kolejkę celów, strzel w pierwszy z kolejki
 *    - Jeśli nie, przejdź do trybu HUNT
 *
 * 2. MODE: HUNT (losowe poszukiwanie)
 *    - Strzel w losową dostępną komórkę
 *    - Opcjonalnie: preferuj szachownicę (parzystość) dla optymalizacji
 *
 * @param board - Plansza gracza (cel AI)
 * @param aiState - Stan AI (modyfikowany in-place)
 * @returns Pozycja do ostrzelania
 */
export function calculateAIShot(board: Board, aiState: AIState): Position {
  // MODE: TARGET - mamy trafienie, celujemy w sąsiednie komórki
  if (aiState.mode === 'target' && aiState.targetQueue.length > 0) {
    // Pobierz pierwszy cel z kolejki
    const target = aiState.targetQueue.shift()!;

    // Sprawdź czy nadal dostępny
    if (isCellAvailable(board, target)) {
      return target;
    }

    // Jeśli niedostępny, spróbuj kolejnego
    return calculateAIShot(board, aiState);
  }

  // Jeśli nie ma celów, przejdź do trybu HUNT
  if (aiState.mode === 'target' && aiState.targetQueue.length === 0) {
    aiState.mode = 'hunt';
  }

  // MODE: HUNT - losowe poszukiwanie
  return getRandomAvailableCell(board);
}

/**
 * Zwraca losową dostępną komórkę
 */
function getRandomAvailableCell(board: Board): Position {
  const available: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isCellAvailable(board, { row, col })) {
        available.push({ row, col });
      }
    }
  }

  if (available.length === 0) {
    throw new Error('No available cells to shoot at');
  }

  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Aktualizuje stan AI po wykonaniu strzału
 *
 * @param aiState - Stan AI (modyfikowany in-place)
 * @param position - Pozycja strzału
 * @param wasHit - Czy strzał trafił okręt
 * @param wasSunk - Czy strzał zatopił okręt
 */
export function updateAIState(
  aiState: AIState,
  position: Position,
  wasHit: boolean,
  wasSunk: boolean
): void {
  if (wasHit) {
    // Dodaj trafienie do historii
    aiState.hits.push(position);
    aiState.lastHit = position;

    if (wasSunk) {
      // Okręt zatopiony - wyczyść cele i wróć do trybu HUNT
      aiState.mode = 'hunt';
      aiState.targetQueue = [];
      aiState.lastHit = null;
    } else {
      // Trafienie bez zatopienia - przejdź do trybu TARGET
      aiState.mode = 'target';

      // Dodaj sąsiednie komórki do kolejki celów
      const adjacent = getAdjacentCells(position);

      // Dodaj tylko te, które nie są już w kolejce
      for (const cell of adjacent) {
        const alreadyInQueue = aiState.targetQueue.some(
          (target) => target.row === cell.row && target.col === cell.col
        );

        if (!alreadyInQueue) {
          aiState.targetQueue.push(cell);
        }
      }

      // Opcjonalnie: sortuj kolejkę aby preferować kierunek
      // (jeśli mamy 2+ trafienia w linii, strzelaj w tym samym kierunku)
      if (aiState.hits.length >= 2) {
        prioritizeDirection(aiState);
      }
    }
  }
  // Jeśli pudło, nie robimy nic - kontynuujemy obecną strategię
}

/**
 * Priorytetyzuje kierunek na podstawie poprzednich trafień
 *
 * Jeśli mamy 2+ trafienia w linii (poziomej lub pionowej),
 * przesuń cele w tym kierunku na początek kolejki.
 */
function prioritizeDirection(aiState: AIState): void {
  if (aiState.hits.length < 2) return;

  const lastHit = aiState.hits[aiState.hits.length - 1];
  const secondLastHit = aiState.hits[aiState.hits.length - 2];

  // Sprawdź czy w tej samej linii
  const sameRow = lastHit.row === secondLastHit.row;
  const sameCol = lastHit.col === secondLastHit.col;

  if (!sameRow && !sameCol) return;

  // Sortuj kolejkę: cele w tym samym rzędzie/kolumnie na początku
  aiState.targetQueue.sort((a, b) => {
    const aInLine = sameRow ? a.row === lastHit.row : a.col === lastHit.col;
    const bInLine = sameRow ? b.row === lastHit.row : b.col === lastHit.col;

    if (aInLine && !bInLine) return -1;
    if (!aInLine && bInLine) return 1;
    return 0;
  });
}