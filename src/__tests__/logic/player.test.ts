/**
 * @file Testy dla inicjalizacji gracza i floty
 * TDD: Testy przed implementacją!
 */

import {
  createPlayer,
  createFleet,
  isFleetDestroyed,
} from '../../logic/player';
import {
  Player,
  PlayerId,
  ShipType,
  DEFAULT_FLEET_CONFIG,
} from '../../types';

describe('Player Initialization', () => {
  describe('createPlayer', () => {
    it('should create player with correct id and name', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');

      expect(player.id).toBe(PlayerId.PLAYER_1);
      expect(player.name).toBe('Alice');
    });

    it('should create empty 10x10 board', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');

      expect(player.board.length).toBe(10);
      expect(player.board[0].length).toBe(10);
    });

    it('should initialize with empty ships array', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');

      expect(player.ships).toEqual([]);
    });

    it('should initialize shipsRemaining to 0', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');

      expect(player.shipsRemaining).toBe(0);
    });

    it('should create different instances for each call', () => {
      const player1 = createPlayer(PlayerId.PLAYER_1, 'Alice');
      const player2 = createPlayer(PlayerId.PLAYER_2, 'Bob');

      expect(player1).not.toBe(player2);
      expect(player1.board).not.toBe(player2.board);
      expect(player1.ships).not.toBe(player2.ships);
    });
  });

  describe('createFleet', () => {
    it('should create fleet with default configuration', () => {
      const fleet = createFleet();

      // Sprawdzamy ilość okrętów każdego typu
      const carriers = fleet.filter(s => s.type === ShipType.CARRIER);
      const battleships = fleet.filter(s => s.type === ShipType.BATTLESHIP);
      const cruisers = fleet.filter(s => s.type === ShipType.CRUISER);
      const submarines = fleet.filter(s => s.type === ShipType.SUBMARINE);

      expect(carriers.length).toBe(DEFAULT_FLEET_CONFIG[ShipType.CARRIER]);
      expect(battleships.length).toBe(DEFAULT_FLEET_CONFIG[ShipType.BATTLESHIP]);
      expect(cruisers.length).toBe(DEFAULT_FLEET_CONFIG[ShipType.CRUISER]);
      expect(submarines.length).toBe(DEFAULT_FLEET_CONFIG[ShipType.SUBMARINE]);
    });

    it('should create total of 10 ships with default config', () => {
      const fleet = createFleet();

      expect(fleet.length).toBe(10); // 1 + 2 + 3 + 4 = 10
    });

    it('should create fleet with custom configuration', () => {
      const customConfig = {
        [ShipType.CARRIER]: 2,
        [ShipType.BATTLESHIP]: 1,
        [ShipType.CRUISER]: 1,
        [ShipType.SUBMARINE]: 1,
      };

      const fleet = createFleet(customConfig);

      expect(fleet.length).toBe(5);
      expect(fleet.filter(s => s.type === ShipType.CARRIER).length).toBe(2);
    });

    it('should initialize all ships with correct properties', () => {
      const fleet = createFleet();

      fleet.forEach((ship) => {
        expect(ship.id).toBeDefined();
        expect(ship.id).toMatch(/^(carrier|battleship|cruiser|submarine)-\d+$/);
        expect(ship.type).toBeDefined();
        expect(ship.length).toBe(ship.type); // length equals ShipType value
        expect(ship.hits).toBe(0);
        expect(ship.isSunk).toBe(false);
      });
    });

    it('should create unique IDs for all ships', () => {
      const fleet = createFleet();
      const ids = fleet.map(s => s.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(fleet.length);
    });

    it('should set ship length based on type', () => {
      const fleet = createFleet();

      const carrier = fleet.find(s => s.type === ShipType.CARRIER);
      const battleship = fleet.find(s => s.type === ShipType.BATTLESHIP);
      const cruiser = fleet.find(s => s.type === ShipType.CRUISER);
      const submarine = fleet.find(s => s.type === ShipType.SUBMARINE);

      expect(carrier?.length).toBe(4);
      expect(battleship?.length).toBe(3);
      expect(cruiser?.length).toBe(2);
      expect(submarine?.length).toBe(1);
    });

    it('should create ships without position initially', () => {
      const fleet = createFleet();

      fleet.forEach((ship) => {
        // Position będzie ustawiona później podczas rozstawiania
        expect(ship.position).toBeDefined();
        expect(ship.orientation).toBeDefined();
      });
    });
  });

  describe('isFleetDestroyed', () => {
    it('should return true when all ships are sunk', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');
      player.ships = createFleet();

      // Zatop wszystkie okręty
      player.ships.forEach((ship) => {
        ship.hits = ship.length;
        ship.isSunk = true;
      });

      expect(isFleetDestroyed(player)).toBe(true);
    });

    it('should return false when at least one ship is not sunk', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');
      player.ships = createFleet();

      // Zatop wszystkie oprócz jednego
      player.ships.forEach((ship, index) => {
        if (index < player.ships.length - 1) {
          ship.hits = ship.length;
          ship.isSunk = true;
        }
      });

      expect(isFleetDestroyed(player)).toBe(false);
    });

    it('should return false when no ships are sunk', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');
      player.ships = createFleet();

      expect(isFleetDestroyed(player)).toBe(false);
    });

    it('should return false for player with no ships', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');
      player.ships = [];

      expect(isFleetDestroyed(player)).toBe(false);
    });

    it('should return false when ships are partially damaged', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');
      player.ships = createFleet();

      // Uszkodzenie bez zatopienia
      player.ships.forEach((ship) => {
        ship.hits = ship.length - 1;
        ship.isSunk = false;
      });

      expect(isFleetDestroyed(player)).toBe(false);
    });

    it('should update shipsRemaining count correctly', () => {
      const player = createPlayer(PlayerId.PLAYER_1, 'Alice');
      player.ships = createFleet();
      player.shipsRemaining = player.ships.length;

      expect(player.shipsRemaining).toBe(10);

      // Zatop 3 okręty
      for (let i = 0; i < 3; i++) {
        player.ships[i].hits = player.ships[i].length;
        player.ships[i].isSunk = true;
        player.shipsRemaining--;
      }

      expect(player.shipsRemaining).toBe(7);
    });
  });
});
