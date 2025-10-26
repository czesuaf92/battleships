/**
 * @file Testy dla zarządzania stanem gry
 * TDD: Testy przed implementacją!
 */

import {
  createGameState,
  initializeGame,
  switchTurn,
  checkVictory,
  getOpponent,
  getCurrentPlayer,
  getOpponentPlayer,
} from '../../logic/game-state';
import {
  GameState,
  PlayerId,
  GamePhase,
  Player,
} from '../../types';

describe('Game State Management', () => {
  describe('createGameState', () => {
    it('should create initial game state in SETUP phase', () => {
      const state = createGameState('Alice', 'Bob');

      expect(state.phase).toBe(GamePhase.SETUP);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);
      expect(state.turnCount).toBe(0);
      expect(state.winner).toBeUndefined();
    });

    it('should initialize both players', () => {
      const state = createGameState('Alice', 'Bob');

      expect(state.players[PlayerId.PLAYER_1].name).toBe('Alice');
      expect(state.players[PlayerId.PLAYER_2].name).toBe('Bob');
    });

    it('should create players with empty boards', () => {
      const state = createGameState('Alice', 'Bob');

      expect(state.players[PlayerId.PLAYER_1].board.length).toBe(10);
      expect(state.players[PlayerId.PLAYER_2].board.length).toBe(10);
    });

    it('should initialize players with empty ships', () => {
      const state = createGameState('Alice', 'Bob');

      expect(state.players[PlayerId.PLAYER_1].ships).toEqual([]);
      expect(state.players[PlayerId.PLAYER_2].ships).toEqual([]);
    });
  });

  describe('initializeGame', () => {
    let state: GameState;

    beforeEach(() => {
      state = createGameState('Alice', 'Bob');
    });

    it('should transition from SETUP to BATTLE phase', () => {
      initializeGame(state);

      expect(state.phase).toBe(GamePhase.BATTLE);
    });

    it('should create fleet for both players', () => {
      initializeGame(state);

      expect(state.players[PlayerId.PLAYER_1].ships.length).toBe(10);
      expect(state.players[PlayerId.PLAYER_2].ships.length).toBe(10);
    });

    it('should set shipsRemaining to fleet size', () => {
      initializeGame(state);

      expect(state.players[PlayerId.PLAYER_1].shipsRemaining).toBe(10);
      expect(state.players[PlayerId.PLAYER_2].shipsRemaining).toBe(10);
    });

    it('should start with PLAYER_1 turn', () => {
      initializeGame(state);

      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);
      expect(state.turnCount).toBe(1);
    });

    it('should not modify already initialized game', () => {
      initializeGame(state);
      const shipsP1 = state.players[PlayerId.PLAYER_1].ships;

      // Próba ponownej inicjalizacji
      initializeGame(state);

      // Okręty powinny pozostać te same
      expect(state.players[PlayerId.PLAYER_1].ships).toBe(shipsP1);
    });
  });

  describe('switchTurn', () => {
    let state: GameState;

    beforeEach(() => {
      state = createGameState('Alice', 'Bob');
      initializeGame(state);
    });

    it('should switch from PLAYER_1 to PLAYER_2', () => {
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      switchTurn(state);

      expect(state.currentPlayer).toBe(PlayerId.PLAYER_2);
    });

    it('should switch from PLAYER_2 to PLAYER_1', () => {
      state.currentPlayer = PlayerId.PLAYER_2;

      switchTurn(state);

      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);
    });

    it('should increment turn count', () => {
      const initialTurnCount = state.turnCount;

      switchTurn(state);

      expect(state.turnCount).toBe(initialTurnCount + 1);
    });

    it('should work multiple times in sequence', () => {
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      switchTurn(state);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_2);

      switchTurn(state);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_1);

      switchTurn(state);
      expect(state.currentPlayer).toBe(PlayerId.PLAYER_2);

      expect(state.turnCount).toBe(4); // 1 początkowa + 3 switche
    });
  });

  describe('getOpponent', () => {
    it('should return PLAYER_2 for PLAYER_1', () => {
      expect(getOpponent(PlayerId.PLAYER_1)).toBe(PlayerId.PLAYER_2);
    });

    it('should return PLAYER_1 for PLAYER_2', () => {
      expect(getOpponent(PlayerId.PLAYER_2)).toBe(PlayerId.PLAYER_1);
    });
  });

  describe('getCurrentPlayer', () => {
    let state: GameState;

    beforeEach(() => {
      state = createGameState('Alice', 'Bob');
      initializeGame(state);
    });

    it('should return current player object', () => {
      const player = getCurrentPlayer(state);

      expect(player.id).toBe(state.currentPlayer);
      expect(player.name).toBe('Alice'); // PLAYER_1 starts
    });

    it('should return correct player after turn switch', () => {
      switchTurn(state);
      const player = getCurrentPlayer(state);

      expect(player.id).toBe(PlayerId.PLAYER_2);
      expect(player.name).toBe('Bob');
    });
  });

  describe('getOpponentPlayer', () => {
    let state: GameState;

    beforeEach(() => {
      state = createGameState('Alice', 'Bob');
      initializeGame(state);
    });

    it('should return opponent player object', () => {
      const opponent = getOpponentPlayer(state);

      expect(opponent.id).toBe(PlayerId.PLAYER_2);
      expect(opponent.name).toBe('Bob');
    });

    it('should return correct opponent after turn switch', () => {
      switchTurn(state);
      const opponent = getOpponentPlayer(state);

      expect(opponent.id).toBe(PlayerId.PLAYER_1);
      expect(opponent.name).toBe('Alice');
    });
  });

  describe('checkVictory', () => {
    let state: GameState;

    beforeEach(() => {
      state = createGameState('Alice', 'Bob');
      initializeGame(state);
    });

    it('should return null when no winner', () => {
      const winner = checkVictory(state);

      expect(winner).toBeNull();
      expect(state.phase).toBe(GamePhase.BATTLE);
      expect(state.winner).toBeUndefined();
    });

    it('should detect PLAYER_1 victory when all PLAYER_2 ships sunk', () => {
      // Zatop wszystkie okręty PLAYER_2
      state.players[PlayerId.PLAYER_2].ships.forEach((ship) => {
        ship.hits = ship.length;
        ship.isSunk = true;
      });
      state.players[PlayerId.PLAYER_2].shipsRemaining = 0;

      const winner = checkVictory(state);

      expect(winner).toBe(PlayerId.PLAYER_1);
      expect(state.phase).toBe(GamePhase.GAME_OVER);
      expect(state.winner).toBe(PlayerId.PLAYER_1);
    });

    it('should detect PLAYER_2 victory when all PLAYER_1 ships sunk', () => {
      // Zatop wszystkie okręty PLAYER_1
      state.players[PlayerId.PLAYER_1].ships.forEach((ship) => {
        ship.hits = ship.length;
        ship.isSunk = true;
      });
      state.players[PlayerId.PLAYER_1].shipsRemaining = 0;

      const winner = checkVictory(state);

      expect(winner).toBe(PlayerId.PLAYER_2);
      expect(state.phase).toBe(GamePhase.GAME_OVER);
      expect(state.winner).toBe(PlayerId.PLAYER_2);
    });

    it('should not declare victory if both players have ships', () => {
      // Częściowe uszkodzenia
      state.players[PlayerId.PLAYER_1].ships[0].hits = 2;
      state.players[PlayerId.PLAYER_2].ships[0].hits = 2;

      const winner = checkVictory(state);

      expect(winner).toBeNull();
      expect(state.phase).toBe(GamePhase.BATTLE);
    });

    it('should only check victory in BATTLE phase', () => {
      state.phase = GamePhase.SETUP;

      // Zatop wszystkie okręty PLAYER_2
      state.players[PlayerId.PLAYER_2].ships.forEach((ship) => {
        ship.hits = ship.length;
        ship.isSunk = true;
      });

      const winner = checkVictory(state);

      expect(winner).toBeNull();
      expect(state.phase).toBe(GamePhase.SETUP); // Nie zmienia fazy
    });

    it('should not check victory after GAME_OVER', () => {
      state.phase = GamePhase.GAME_OVER;
      state.winner = PlayerId.PLAYER_1;

      const winner = checkVictory(state);

      expect(winner).toBe(PlayerId.PLAYER_1); // Zwraca obecnego zwycięzcę
    });
  });
});
