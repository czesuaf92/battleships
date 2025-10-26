/**
 * @file Zarządzanie turami z bonusem za trafienie
 */

import {
  GameState,
  Position,
  ShotResult,
  Ship,
  PlayerId,
  GamePhase,
} from '../types';
import { processShot } from './combat';
import { getOpponentPlayer, switchTurn, checkVictory } from './game-state';
import { isPositionValid } from '../utils/coordinates';

/**
 * Wynik tury gracza
 */
export interface TurnResult {
  shotResult: ShotResult;
  continuesTurn: boolean; // true jeśli gracz może strzelać ponownie
  winner?: PlayerId;
  sunkShip?: Ship;
  error?: string;
}

/**
 * Sprawdza czy gracz może strzelać ponownie (bonus za trafienie)
 *
 * Gracz strzela ponownie gdy:
 * - Trafił okręt (HIT)
 * - Zatopił okręt (SUNK)
 *
 * @param shotResult - Wynik strzału
 * @returns true jeśli gracz może strzelać ponownie
 *
 * @example
 * canShootAgain(ShotResult.HIT);  // true - gracz strzela ponownie
 * canShootAgain(ShotResult.SUNK); // true - gracz strzela ponownie
 * canShootAgain(ShotResult.MISS); // false - tura przechodzi do przeciwnika
 */
export function canShootAgain(shotResult: ShotResult): boolean {
  return shotResult === ShotResult.HIT || shotResult === ShotResult.SUNK;
}

/**
 * Przetwarza turę gracza - wykonuje strzał i zarządza zmianą tur
 *
 * Logika tury:
 * 1. Waliduje pozycję strzału
 * 2. Sprawdza czy gra w fazie BATTLE
 * 3. Wykonuje strzał na planszy przeciwnika
 * 4. Jeśli MISS - zmienia turę
 * 5. Jeśli HIT/SUNK - gracz strzela ponownie (bonus!)
 * 6. Po każdym strzale sprawdza warunki zwycięstwa
 * 7. Aktualizuje licznik zatopionych okrętów
 *
 * @param state - Stan gry (modyfikowany in-place)
 * @param position - Pozycja strzału
 * @returns Wynik tury z informacją czy gracz kontynuuje
 *
 * @example
 * const state = createGameState('Alice', 'Bob');
 * initializeGame(state);
 *
 * const result = processTurn(state, { row: 5, col: 5 });
 * if (result.shotResult === ShotResult.HIT) {
 *   console.log('Trafienie! Strzelaj ponownie!');
 * } else {
 *   console.log('Pudło - tura przeciwnika');
 * }
 *
 * if (result.winner) {
 *   console.log(`${state.players[result.winner].name} wygrywa!`);
 * }
 */
export function processTurn(state: GameState, position: Position): TurnResult {
  // Walidacja pozycji
  if (!isPositionValid(position.row, position.col)) {
    return {
      shotResult: ShotResult.MISS,
      continuesTurn: false,
      error: 'Invalid position - outside board boundaries',
    };
  }

  // Sprawdź czy gra jest w fazie BATTLE
  if (state.phase !== GamePhase.BATTLE) {
    return {
      shotResult: ShotResult.MISS,
      continuesTurn: false,
      error: `Cannot shoot - game is ${
        state.phase === GamePhase.GAME_OVER
          ? 'over'
          : 'not in BATTLE phase'
      }`,
    };
  }

  // Pobierz przeciwnika (to jego plansza będzie ostrzeliwana)
  const opponent = getOpponentPlayer(state);
  const currentPlayer = state.players[state.currentPlayer];

  // Wykonaj strzał
  const shotResult = processShot(opponent.board, position, opponent.ships);

  // Aktualizuj statystyki strzelającego gracza
  currentPlayer.stats.shotsFired++;
  if (shotResult === ShotResult.HIT || shotResult === ShotResult.SUNK) {
    currentPlayer.stats.hits++;
  } else if (shotResult === ShotResult.MISS) {
    currentPlayer.stats.misses++;
  }

  // Znajdź zatopiony okręt (jeśli był)
  let sunkShip: Ship | undefined;
  if (shotResult === ShotResult.SUNK) {
    const cell = opponent.board[position.row][position.col];
    if (cell.shipId) {
      sunkShip = opponent.ships.find((s) => s.id === cell.shipId);
      if (sunkShip) {
        // Zmniejsz licznik okrętów
        opponent.shipsRemaining--;
        // Aktualizuj statystyki zatopionych okrętów
        currentPlayer.stats.shipsDestroyed++;
      }
    }
  }

  // Sprawdź warunki zwycięstwa
  const winner = checkVictory(state);

  // Określ czy gracz kontynuuje turę (bonus za trafienie)
  const continuesTurn = canShootAgain(shotResult);

  // Jeśli pudło - zmień turę
  if (!continuesTurn && !winner) {
    switchTurn(state);
  }

  return {
    shotResult,
    continuesTurn,
    winner: winner || undefined,
    sunkShip,
  };
}
