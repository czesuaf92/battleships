/**
 * @file Testy dla logiki walki (strzały, trafienia, zatopienia)
 * TDD: Testy przed implementacją!
 */

import {
  processShot,
  isShipSunk,
  findShipById,
  getAllShipsFromBoard,
} from '../../logic/combat';
import { createEmptyBoard, placeShip } from '../../logic';
import {
  Board,
  Ship,
  ShipType,
  Orientation,
  CellStatus,
  ShotResult,
  Position,
} from '../../types';

describe('Combat Logic', () => {
  describe('processShot', () => {
    let board: Board;
    let ships: Ship[];

    beforeEach(() => {
      board = createEmptyBoard();
      ships = [];

      // Umieść okręt 3-polowy poziomo w row=5, col=3-5
      const ship: Ship = {
        id: 'battleship-1',
        type: ShipType.BATTLESHIP,
        length: 3,
        position: { row: 5, col: 3 },
        orientation: Orientation.HORIZONTAL,
        hits: 0,
        isSunk: false,
      };
      ships.push(ship);
      placeShip(board, ship);
    });

    it('should return MISS when shooting at empty water', () => {
      const result = processShot(board, { row: 0, col: 0 }, ships);

      expect(result).toBe(ShotResult.MISS);
      expect(board[0][0].status).toBe(CellStatus.MISS);
    });

    it('should return HIT when hitting a ship', () => {
      const result = processShot(board, { row: 5, col: 3 }, ships);

      expect(result).toBe(ShotResult.HIT);
      expect(board[5][3].status).toBe(CellStatus.HIT);
      expect(ships[0].hits).toBe(1);
    });

    it('should increment ship hits counter', () => {
      processShot(board, { row: 5, col: 3 }, ships);
      expect(ships[0].hits).toBe(1);

      processShot(board, { row: 5, col: 4 }, ships);
      expect(ships[0].hits).toBe(2);
    });

    it('should return SUNK when sinking a ship', () => {
      // Trafienie 1
      processShot(board, { row: 5, col: 3 }, ships);
      expect(ships[0].isSunk).toBe(false);

      // Trafienie 2
      processShot(board, { row: 5, col: 4 }, ships);
      expect(ships[0].isSunk).toBe(false);

      // Trafienie 3 - zatopienie!
      const result = processShot(board, { row: 5, col: 5 }, ships);
      expect(result).toBe(ShotResult.SUNK);
      expect(ships[0].isSunk).toBe(true);
      expect(ships[0].hits).toBe(3);
    });

    it('should mark all ship cells as SUNK when ship is destroyed', () => {
      processShot(board, { row: 5, col: 3 }, ships);
      processShot(board, { row: 5, col: 4 }, ships);
      processShot(board, { row: 5, col: 5 }, ships);

      expect(board[5][3].status).toBe(CellStatus.SUNK);
      expect(board[5][4].status).toBe(CellStatus.SUNK);
      expect(board[5][5].status).toBe(CellStatus.SUNK);
    });

    it('should handle shooting at already hit cell', () => {
      const result1 = processShot(board, { row: 5, col: 3 }, ships);
      expect(result1).toBe(ShotResult.HIT);
      expect(ships[0].hits).toBe(1);

      // Strzelamy w to samo miejsce ponownie
      const result2 = processShot(board, { row: 5, col: 3 }, ships);
      expect(result2).toBe(ShotResult.HIT);
      expect(ships[0].hits).toBe(1); // Licznik nie rośnie
    });

    it('should handle shooting at already missed cell', () => {
      const result1 = processShot(board, { row: 0, col: 0 }, ships);
      expect(result1).toBe(ShotResult.MISS);

      const result2 = processShot(board, { row: 0, col: 0 }, ships);
      expect(result2).toBe(ShotResult.MISS);

      expect(board[0][0].status).toBe(CellStatus.MISS);
    });

    it('should work with single-cell submarine', () => {
      const submarine: Ship = {
        id: 'submarine-1',
        type: ShipType.SUBMARINE,
        length: 1,
        position: { row: 7, col: 7 },
        orientation: Orientation.HORIZONTAL,
        hits: 0,
        isSunk: false,
      };
      ships.push(submarine);
      placeShip(board, submarine);

      const result = processShot(board, { row: 7, col: 7 }, ships);

      expect(result).toBe(ShotResult.SUNK);
      expect(submarine.hits).toBe(1);
      expect(submarine.isSunk).toBe(true);
      expect(board[7][7].status).toBe(CellStatus.SUNK);
    });
  });

  describe('isShipSunk', () => {
    it('should return false for ship with no hits', () => {
      const ship: Ship = {
        id: 'ship-1',
        type: ShipType.BATTLESHIP,
        length: 3,
        position: { row: 0, col: 0 },
        orientation: Orientation.HORIZONTAL,
        hits: 0,
        isSunk: false,
      };

      expect(isShipSunk(ship)).toBe(false);
    });

    it('should return false for ship with partial hits', () => {
      const ship: Ship = {
        id: 'ship-1',
        type: ShipType.CARRIER,
        length: 4,
        position: { row: 0, col: 0 },
        orientation: Orientation.VERTICAL,
        hits: 2,
        isSunk: false,
      };

      expect(isShipSunk(ship)).toBe(false);
    });

    it('should return true when hits equal length', () => {
      const ship: Ship = {
        id: 'ship-1',
        type: ShipType.CRUISER,
        length: 2,
        position: { row: 0, col: 0 },
        orientation: Orientation.HORIZONTAL,
        hits: 2,
        isSunk: false,
      };

      expect(isShipSunk(ship)).toBe(true);
    });

    it('should return true for single-cell ship with one hit', () => {
      const ship: Ship = {
        id: 'submarine',
        type: ShipType.SUBMARINE,
        length: 1,
        position: { row: 0, col: 0 },
        orientation: Orientation.HORIZONTAL,
        hits: 1,
        isSunk: false,
      };

      expect(isShipSunk(ship)).toBe(true);
    });
  });

  describe('findShipById', () => {
    let ships: Ship[];

    beforeEach(() => {
      ships = [
        {
          id: 'ship-1',
          type: ShipType.CARRIER,
          length: 4,
          position: { row: 0, col: 0 },
          orientation: Orientation.HORIZONTAL,
          hits: 0,
          isSunk: false,
        },
        {
          id: 'ship-2',
          type: ShipType.BATTLESHIP,
          length: 3,
          position: { row: 2, col: 0 },
          orientation: Orientation.VERTICAL,
          hits: 1,
          isSunk: false,
        },
        {
          id: 'ship-3',
          type: ShipType.SUBMARINE,
          length: 1,
          position: { row: 9, col: 9 },
          orientation: Orientation.HORIZONTAL,
          hits: 0,
          isSunk: false,
        },
      ];
    });

    it('should find ship by id', () => {
      const ship = findShipById(ships, 'ship-2');

      expect(ship).toBeDefined();
      expect(ship?.id).toBe('ship-2');
      expect(ship?.type).toBe(ShipType.BATTLESHIP);
    });

    it('should return undefined for non-existent id', () => {
      const ship = findShipById(ships, 'non-existent');

      expect(ship).toBeUndefined();
    });

    it('should find first ship', () => {
      const ship = findShipById(ships, 'ship-1');

      expect(ship).toBeDefined();
      expect(ship?.id).toBe('ship-1');
    });

    it('should find last ship', () => {
      const ship = findShipById(ships, 'ship-3');

      expect(ship).toBeDefined();
      expect(ship?.id).toBe('ship-3');
    });
  });

  describe('getAllShipsFromBoard', () => {
    let board: Board;

    beforeEach(() => {
      board = createEmptyBoard();
    });

    it('should return empty array for empty board', () => {
      const shipIds = getAllShipsFromBoard(board);

      expect(shipIds).toEqual([]);
    });

    it('should return unique ship IDs from board', () => {
      // Umieść 3-polowy okręt
      board[0][0].status = CellStatus.SHIP;
      board[0][0].shipId = 'ship-1';
      board[0][1].status = CellStatus.SHIP;
      board[0][1].shipId = 'ship-1';
      board[0][2].status = CellStatus.SHIP;
      board[0][2].shipId = 'ship-1';

      const shipIds = getAllShipsFromBoard(board);

      expect(shipIds).toEqual(['ship-1']);
    });

    it('should return multiple unique ship IDs', () => {
      board[0][0].status = CellStatus.SHIP;
      board[0][0].shipId = 'ship-1';

      board[2][2].status = CellStatus.SHIP;
      board[2][2].shipId = 'ship-2';

      board[5][5].status = CellStatus.SHIP;
      board[5][5].shipId = 'ship-3';

      const shipIds = getAllShipsFromBoard(board);

      expect(shipIds.sort()).toEqual(['ship-1', 'ship-2', 'ship-3'].sort());
    });

    it('should not return IDs from HIT cells', () => {
      board[0][0].status = CellStatus.HIT;
      board[0][0].shipId = 'ship-1';

      const shipIds = getAllShipsFromBoard(board);

      expect(shipIds).toEqual([]);
    });

    it('should handle mixed cell statuses', () => {
      board[0][0].status = CellStatus.SHIP;
      board[0][0].shipId = 'ship-1';

      board[1][1].status = CellStatus.HIT;
      board[1][1].shipId = 'ship-1';

      board[2][2].status = CellStatus.SUNK;
      board[2][2].shipId = 'ship-2';

      board[3][3].status = CellStatus.MISS;

      const shipIds = getAllShipsFromBoard(board);

      expect(shipIds).toEqual(['ship-1']);
    });
  });
});
