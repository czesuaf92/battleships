/**
 * @file Testy dla zarządzania turami z bonusem za trafienie
 * TDD: Testy przed implementacją!
 */

import {
  processTurn,
  canShootAgain,
} from '../../logic/turn-manager';
import {
  createGameState,
  initializeGame,
} from '../../logic/game-state';
import {
  placeShip,
} from '../../logic/ship-placement';
import {
  GameState,
  PlayerId,
  Ship,
  ShipType,
  Orientation,
  ShotResult,
  GamePhase,
} from '../../types';

describe('Turn Manager', () => {
  let state: GameState;

  beforeEach(() => {
    state = createGameState('Alice', 'Bob');
    initializeGame(state);

    // Umieść prosty okręt dla testów
    const ship: Ship = {
      id: 'test-ship',
      type: ShipType.BATTLESHIP,
      length: 3,
      position: { row: 5, col: 3 },
      orientation: Orientation.HORIZONTAL,
      hits: 0,
      isSunk: false,
    };

    // Zastąp pierwszy okręt PLAYER_2 naszym testowym
    state.players[PlayerId.PLAYER_2].ships[0] = ship;
    placeShip(state.players[PlayerId.PLAYER_2].board, ship);
  });

  describe('processTurn', () => {
    it('should process MISS and switch turn', () => {
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      const result = processTurn(state, { row: 0, col: 0 });

      expect(result.shotResult).toBe(ShotResult.MISS);
      expect(result.continuesTurn).toBe(false);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_2); // Tura się zmieniła
    });

    it('should process HIT and keep same player turn', () => {
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      const result = processTurn(state, { row: 5, col: 3 });

      expect(result.shotResult).toBe(ShotResult.HIT);
      expect(result.continuesTurn).toBe(true);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1); // Ta sama tura
    });

    it('should process SUNK and keep same player turn', () => {
      // Uszkodzenie okrętu do 2 hitów (z 3)
      state.players[PlayerId.PLAYER_2].ships[0].hits = 2;
      state.players[PlayerId.PLAYER_2].board[5][3].status = 'hit' as any;
      state.players[PlayerId.PLAYER_2].board[5][4].status = 'hit' as any;

      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      // Ostatni strzał - zatopienie
      const result = processTurn(state, { row: 5, col: 5 });

      expect(result.shotResult).toBe(ShotResult.SUNK);
      expect(result.continuesTurn).toBe(true);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1); // Ta sama tura
    });

    it('should update ship data after hit', () => {
      const ship = state.players[PlayerId.PLAYER_2].ships[0];
      expect(ship.hits).toBe(0);

      processTurn(state, { row: 5, col: 3 });

      expect(ship.hits).toBe(1);
      expect(ship.isSunk).toBe(false);
    });

    it('should update board after shot', () => {
      const board = state.players[PlayerId.PLAYER_2].board;

      // Pudło
      processTurn(state, { row: 0, col: 0 });
      expect(board[0][0].status).toBe('miss' as any);

      // Reset gracza dla kolejnego strzału
      state.currentPlayer = PlayerId.PLAYER_1;

      // Trafienie
      processTurn(state, { row: 5, col: 3 });
      expect(board[5][3].status).toBe('hit' as any);
    });

    it('should check victory after each shot', () => {
      // Zatop wszystkie okręty oprócz testowego
      state.players[PlayerId.PLAYER_2].ships.slice(1).forEach((ship) => {
        ship.hits = ship.length;
        ship.isSunk = true;
      });
      state.players[PlayerId.PLAYER_2].shipsRemaining = 1;

      // Zatop testowy okręt całkowicie
      processTurn(state, { row: 5, col: 3 });
      state.currentPlayer = PlayerId.PLAYER_1; // Reset po trafieniu

      processTurn(state, { row: 5, col: 4 });
      state.currentPlayer = PlayerId.PLAYER_1; // Reset po trafieniu

      const result = processTurn(state, { row: 5, col: 5 });

      expect(result.winner).toBe(PlayerId.PLAYER_1);
      expect(state.phase).toBe(GamePhase.GAME_OVER);
      expect(state.winner).toBe(PlayerId.PLAYER_1);
    });

    it('should not allow shooting in GAME_OVER phase', () => {
      state.phase = GamePhase.GAME_OVER;
      state.winner = PlayerId.PLAYER_1;

      const result = processTurn(state, { row: 0, col: 0 });

      expect(result.shotResult).toBe(ShotResult.MISS);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('game is over');
    });

    it('should not allow shooting in SETUP phase', () => {
      state.phase = GamePhase.SETUP;

      const result = processTurn(state, { row: 0, col: 0 });

      expect(result.shotResult).toBe(ShotResult.MISS);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('not in BATTLE');
    });

    it('should handle shooting at already shot cell', () => {
      // Pierwszy strzał - pudło
      processTurn(state, { row: 0, col: 0 });

      // Reset gracza
      state.currentPlayer = PlayerId.PLAYER_1;

      // Strzał w to samo miejsce
      const result = processTurn(state, { row: 0, col: 0 });

      expect(result.shotResult).toBe(ShotResult.MISS);
      // Nadal zmienia turę (nie ma bonusu za strzelanie w to samo miejsce)
      expect(result.continuesTurn).toBe(false);
    });

    it('should decrement shipsRemaining when ship sunk', () => {
      const initialRemaining = state.players[PlayerId.PLAYER_2].shipsRemaining;

      // Zatop okręt (3 strzały)
      processTurn(state, { row: 5, col: 3 });
      state.currentPlayer = PlayerId.PLAYER_1;

      processTurn(state, { row: 5, col: 4 });
      state.currentPlayer = PlayerId.PLAYER_1;

      const result = processTurn(state, { row: 5, col: 5 });

      expect(result.shotResult).toBe(ShotResult.SUNK);
      expect(state.players[PlayerId.PLAYER_2].shipsRemaining).toBe(
        initialRemaining - 1
      );
    });

    it('should return sunk ship info', () => {
      // Uszkodzenie do 2 hitów
      state.players[PlayerId.PLAYER_2].ships[0].hits = 2;

      const result = processTurn(state, { row: 5, col: 5 });

      expect(result.shotResult).toBe(ShotResult.SUNK);
      expect(result.sunkShip).toBeDefined();
      expect(result.sunkShip?.id).toBe('test-ship');
      expect(result.sunkShip?.isSunk).toBe(true);
    });
  });

  describe('canShootAgain', () => {
    it('should return true for HIT', () => {
      expect(canShootAgain(ShotResult.HIT)).toBe(true);
    });

    it('should return true for SUNK', () => {
      expect(canShootAgain(ShotResult.SUNK)).toBe(true);
    });

    it('should return false for MISS', () => {
      expect(canShootAgain(ShotResult.MISS)).toBe(false);
    });
  });

  describe('multiple consecutive hits', () => {
    it('should allow multiple shots in a row on hits', () => {
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      // Trafienie 1
      const result1 = processTurn(state, { row: 5, col: 3 });
      expect(result1.shotResult).toBe(ShotResult.HIT);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      // Trafienie 2
      const result2 = processTurn(state, { row: 5, col: 4 });
      expect(result2.shotResult).toBe(ShotResult.HIT);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      // Trafienie 3 - zatopienie
      const result3 = processTurn(state, { row: 5, col: 5 });
      expect(result3.shotResult).toBe(ShotResult.SUNK);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      // Pudło - koniec tury
      const result4 = processTurn(state, { row: 0, col: 0 });
      expect(result4.shotResult).toBe(ShotResult.MISS);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_2);
    });
  });

  describe('edge cases', () => {
    it('should handle shooting outside board boundaries', () => {
      const result = processTurn(state, { row: -1, col: 5 });

      expect(result.error).toBeDefined();
      expect(result.error).toContain('Invalid position');
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1); // Nie zmienia tury
    });

    it('should handle invalid position', () => {
      const result = processTurn(state, { row: 10, col: 10 });

      expect(result.error).toBeDefined();
      expect(result.error).toContain('Invalid position');
    });
  });
});
