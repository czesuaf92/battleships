/**
 * @file Zarządzanie stanem gry
 */

import {
  GameState,
  Player,
  PlayerId,
  GamePhase,
} from '../types';
import { createPlayer, createFleet, isFleetDestroyed } from './player';

/**
 * Tworzy początkowy stan gry
 *
 * Gra startuje w fazie SETUP (rozstawianie okrętów)
 *
 * @param player1Name - Nazwa pierwszego gracza
 * @param player2Name - Nazwa drugiego gracza
 * @returns Nowy stan gry gotowy do rozstawienia okrętów
 *
 * @example
 * const state = createGameState('Alice', 'Bob');
 * console.log(state.phase); // GamePhase.SETUP
 * console.log(state.currentPlayer); // PlayerId.PLAYER_1
 */
export function createGameState(
  player1Name: string,
  player2Name: string
): GameState {
  const player1 = createPlayer(PlayerId.PLAYER_1, player1Name);
  const player2 = createPlayer(PlayerId.PLAYER_2, player2Name);

  return {
    phase: GamePhase.SETUP,
    currentPlayer: PlayerId.PLAYER_1,
    players: {
      [PlayerId.PLAYER_1]: player1,
      [PlayerId.PLAYER_2]: player2,
    },
    winner: undefined,
    turnCount: 0,
  };
}

/**
 * Inicjalizuje grę - tworzy floty i rozpoczyna walkę
 *
 * Przechodzi z fazy SETUP do BATTLE.
 * Tworzy floty dla obu graczy (jeśli jeszcze nie istnieją).
 *
 * @param state - Stan gry (modyfikowany in-place)
 *
 * @example
 * const state = createGameState('Alice', 'Bob');
 * // ... gracze rozstawiają okręty ...
 * initializeGame(state);
 * console.log(state.phase); // GamePhase.BATTLE
 * console.log(state.players[PlayerId.PLAYER_1].ships.length); // 10
 */
export function initializeGame(state: GameState): void {
  // Jeśli gra już zainicjalizowana, nie rób nic
  if (state.phase !== GamePhase.SETUP) {
    return;
  }

  // Stwórz floty jeśli jeszcze nie istnieją
  if (state.players[PlayerId.PLAYER_1].ships.length === 0) {
    state.players[PlayerId.PLAYER_1].ships = createFleet();
    state.players[PlayerId.PLAYER_1].shipsRemaining =
      state.players[PlayerId.PLAYER_1].ships.length;
  }

  if (state.players[PlayerId.PLAYER_2].ships.length === 0) {
    state.players[PlayerId.PLAYER_2].ships = createFleet();
    state.players[PlayerId.PLAYER_2].shipsRemaining =
      state.players[PlayerId.PLAYER_2].ships.length;
  }

  // Przejdź do fazy walki
  state.phase = GamePhase.BATTLE;

  // Rozpocznij od pierwszego gracza
  state.currentPlayer = PlayerId.PLAYER_1;
  state.turnCount = 1;
}

/**
 * Zmienia turę na przeciwnika
 *
 * Przełącza currentPlayer między PLAYER_1 i PLAYER_2.
 * Zwiększa licznik tur.
 *
 * @param state - Stan gry (modyfikowany in-place)
 *
 * @example
 * const state = createGameState('Alice', 'Bob');
 * initializeGame(state);
 *
 * console.log(state.currentPlayer); // PlayerId.PLAYER_1
 * switchTurn(state);
 * console.log(state.currentPlayer); // PlayerId.PLAYER_2
 */
export function switchTurn(state: GameState): void {
  state.currentPlayer = getOpponent(state.currentPlayer);
  state.turnCount++;
}

/**
 * Zwraca przeciwnika dla danego gracza
 *
 * @param playerId - ID gracza
 * @returns ID przeciwnika
 *
 * @example
 * getOpponent(PlayerId.PLAYER_1); // PlayerId.PLAYER_2
 * getOpponent(PlayerId.PLAYER_2); // PlayerId.PLAYER_1
 */
export function getOpponent(playerId: PlayerId): PlayerId {
  return playerId === PlayerId.PLAYER_1 ? PlayerId.PLAYER_2 : PlayerId.PLAYER_1;
}

/**
 * Zwraca obiekt aktualnego gracza
 *
 * @param state - Stan gry
 * @returns Aktualny gracz
 *
 * @example
 * const state = createGameState('Alice', 'Bob');
 * const player = getCurrentPlayer(state);
 * console.log(player.name); // 'Alice'
 */
export function getCurrentPlayer(state: GameState): Player {
  return state.players[state.currentPlayer];
}

/**
 * Zwraca obiekt przeciwnika
 *
 * @param state - Stan gry
 * @returns Przeciwnik aktualnego gracza
 *
 * @example
 * const state = createGameState('Alice', 'Bob');
 * const opponent = getOpponentPlayer(state);
 * console.log(opponent.name); // 'Bob'
 */
export function getOpponentPlayer(state: GameState): Player {
  const opponentId = getOpponent(state.currentPlayer);
  return state.players[opponentId];
}

/**
 * Sprawdza warunki zwycięstwa
 *
 * Sprawdza czy któryś z graczy zatopił wszystkie okręty przeciwnika.
 * Jeśli tak - ustawia zwycięzcę i zmienia fazę na GAME_OVER.
 *
 * @param state - Stan gry (modyfikowany in-place przy zwycięstwie)
 * @returns ID zwycięzcy lub null jeśli gra trwa
 *
 * @example
 * const state = createGameState('Alice', 'Bob');
 * initializeGame(state);
 *
 * // Po zatopieniu wszystkich okrętów przeciwnika
 * const winner = checkVictory(state);
 * if (winner) {
 *   console.log(`${state.players[winner].name} wins!`);
 * }
 */
export function checkVictory(state: GameState): PlayerId | null {
  // Nie sprawdzamy zwycięstwa w fazie SETUP
  if (state.phase === GamePhase.SETUP) {
    return null;
  }

  // Jeśli gra już się skończyła, zwróć zwycięzcę
  if (state.phase === GamePhase.GAME_OVER && state.winner) {
    return state.winner;
  }

  // Sprawdź czy któryś gracz zatopił wszystkie okręty przeciwnika
  const player1Destroyed = isFleetDestroyed(state.players[PlayerId.PLAYER_1]);
  const player2Destroyed = isFleetDestroyed(state.players[PlayerId.PLAYER_2]);

  if (player2Destroyed) {
    state.phase = GamePhase.GAME_OVER;
    state.winner = PlayerId.PLAYER_1;
    return PlayerId.PLAYER_1;
  }

  if (player1Destroyed) {
    state.phase = GamePhase.GAME_OVER;
    state.winner = PlayerId.PLAYER_2;
    return PlayerId.PLAYER_2;
  }

  return null;
}
