/**
 * @file Testy dla walidacji rozmieszczenia okrętów
 * TDD: Najpierw testy, potem implementacja!
 */

import {
  getShipCells,
  canPlaceShip,
  placeShip,
  hasAdjacentShips,
} from '../../logic/ship-placement';
import { createEmptyBoard } from '../../logic/board';
import {
  Board,
  Ship,
  ShipType,
  Orientation,
  CellStatus,
  Position,
} from '../../types';

describe('Ship Placement Logic', () => {
  describe('getShipCells', () => {
    it('should return correct cells for horizontal ship', () => {
      const position: Position = { row: 2, col: 3 };
      const cells = getShipCells(position, 3, Orientation.HORIZONTAL);

      expect(cells).toEqual([
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
      ]);
    });

    it('should return correct cells for vertical ship', () => {
      const position: Position = { row: 1, col: 5 };
      const cells = getShipCells(position, 4, Orientation.VERTICAL);

      expect(cells).toEqual([
        { row: 1, col: 5 },
        { row: 2, col: 5 },
        { row: 3, col: 5 },
        { row: 4, col: 5 },
      ]);
    });

    it('should return single cell for 1-length ship', () => {
      const position: Position = { row: 0, col: 0 };
      const cells = getShipCells(position, 1, Orientation.HORIZONTAL);

      expect(cells).toEqual([{ row: 0, col: 0 }]);
    });
  });

  describe('canPlaceShip', () => {
    let board: Board;

    beforeEach(() => {
      board = createEmptyBoard();
    });

    describe('boundary validation', () => {
      it('should allow ship within board boundaries', () => {
        expect(
          canPlaceShip(board, { row: 0, col: 0 }, 3, Orientation.HORIZONTAL)
        ).toBe(true);

        expect(
          canPlaceShip(board, { row: 0, col: 0 }, 3, Orientation.VERTICAL)
        ).toBe(true);
      });

      it('should reject horizontal ship extending beyond right edge', () => {
        expect(
          canPlaceShip(board, { row: 0, col: 8 }, 3, Orientation.HORIZONTAL)
        ).toBe(false);

        expect(
          canPlaceShip(board, { row: 0, col: 9 }, 2, Orientation.HORIZONTAL)
        ).toBe(false);
      });

      it('should reject vertical ship extending beyond bottom edge', () => {
        expect(
          canPlaceShip(board, { row: 8, col: 0 }, 3, Orientation.VERTICAL)
        ).toBe(false);

        expect(
          canPlaceShip(board, { row: 9, col: 0 }, 2, Orientation.VERTICAL)
        ).toBe(false);
      });

      it('should allow ship at exact board edge', () => {
        expect(
          canPlaceShip(board, { row: 0, col: 7 }, 3, Orientation.HORIZONTAL)
        ).toBe(true);

        expect(
          canPlaceShip(board, { row: 7, col: 0 }, 3, Orientation.VERTICAL)
        ).toBe(true);
      });
    });

    describe('collision detection', () => {
      it('should reject ship overlapping existing ship', () => {
        // Umieść okręt poziomy w row=2, col=3-5
        board[2][3].status = CellStatus.SHIP;
        board[2][4].status = CellStatus.SHIP;
        board[2][5].status = CellStatus.SHIP;

        // Próba umieszczenia w tym samym miejscu
        expect(
          canPlaceShip(board, { row: 2, col: 3 }, 3, Orientation.HORIZONTAL)
        ).toBe(false);

        // Próba częściowego nakładania
        expect(
          canPlaceShip(board, { row: 2, col: 2 }, 3, Orientation.HORIZONTAL)
        ).toBe(false);

        // Próba przecięcia pionowym okrętem
        expect(
          canPlaceShip(board, { row: 1, col: 4 }, 3, Orientation.VERTICAL)
        ).toBe(false);
      });

      it('should allow ship in empty area', () => {
        board[2][3].status = CellStatus.SHIP;

        expect(
          canPlaceShip(board, { row: 5, col: 5 }, 2, Orientation.HORIZONTAL)
        ).toBe(true);
      });
    });

    describe('adjacency validation (no touching)', () => {
      it('should reject ship adjacent horizontally', () => {
        // Okręt w row=5, col=3-5
        board[5][3].status = CellStatus.SHIP;
        board[5][4].status = CellStatus.SHIP;
        board[5][5].status = CellStatus.SHIP;

        // Próba umieszczenia bezpośrednio obok (po lewej)
        expect(
          canPlaceShip(board, { row: 5, col: 1 }, 2, Orientation.HORIZONTAL)
        ).toBe(false);

        // Próba umieszczenia bezpośrednio obok (po prawej)
        expect(
          canPlaceShip(board, { row: 5, col: 6 }, 2, Orientation.HORIZONTAL)
        ).toBe(false);
      });

      it('should reject ship adjacent vertically', () => {
        // Okręt pionowy w col=3, row=2-4
        board[2][3].status = CellStatus.SHIP;
        board[3][3].status = CellStatus.SHIP;
        board[4][3].status = CellStatus.SHIP;

        // Próba umieszczenia powyżej
        expect(
          canPlaceShip(board, { row: 0, col: 3 }, 2, Orientation.VERTICAL)
        ).toBe(false);

        // Próba umieszczenia poniżej
        expect(
          canPlaceShip(board, { row: 5, col: 3 }, 2, Orientation.VERTICAL)
        ).toBe(false);
      });

      it('should reject ship adjacent diagonally', () => {
        // Okręt w row=5, col=5
        board[5][5].status = CellStatus.SHIP;

        // Próba umieszczenia na ukos (góra-lewo)
        expect(
          canPlaceShip(board, { row: 4, col: 4 }, 1, Orientation.HORIZONTAL)
        ).toBe(false);

        // Próba umieszczenia na ukos (góra-prawo)
        expect(
          canPlaceShip(board, { row: 4, col: 6 }, 1, Orientation.HORIZONTAL)
        ).toBe(false);

        // Próba umieszczenia na ukos (dół-lewo)
        expect(
          canPlaceShip(board, { row: 6, col: 4 }, 1, Orientation.HORIZONTAL)
        ).toBe(false);

        // Próba umieszczenia na ukos (dół-prawo)
        expect(
          canPlaceShip(board, { row: 6, col: 6 }, 1, Orientation.HORIZONTAL)
        ).toBe(false);
      });

      it('should allow ship with 1-cell gap', () => {
        // Okręt w row=5, col=5
        board[5][5].status = CellStatus.SHIP;

        // 1 komórka odstępu - powinno być OK
        expect(
          canPlaceShip(board, { row: 5, col: 7 }, 2, Orientation.HORIZONTAL)
        ).toBe(true);

        expect(
          canPlaceShip(board, { row: 7, col: 5 }, 2, Orientation.VERTICAL)
        ).toBe(true);
      });
    });
  });

  describe('placeShip', () => {
    let board: Board;

    beforeEach(() => {
      board = createEmptyBoard();
    });

    it('should place horizontal ship on board', () => {
      const ship: Ship = {
        id: 'ship-1',
        type: ShipType.CRUISER,
        length: 2,
        position: { row: 3, col: 4 },
        orientation: Orientation.HORIZONTAL,
        hits: 0,
        isSunk: false,
      };

      placeShip(board, ship);

      expect(board[3][4].status).toBe(CellStatus.SHIP);
      expect(board[3][4].shipId).toBe('ship-1');
      expect(board[3][5].status).toBe(CellStatus.SHIP);
      expect(board[3][5].shipId).toBe('ship-1');

      // Inne komórki powinny być puste
      expect(board[3][3].status).toBe(CellStatus.EMPTY);
      expect(board[3][6].status).toBe(CellStatus.EMPTY);
    });

    it('should place vertical ship on board', () => {
      const ship: Ship = {
        id: 'ship-2',
        type: ShipType.BATTLESHIP,
        length: 3,
        position: { row: 1, col: 7 },
        orientation: Orientation.VERTICAL,
        hits: 0,
        isSunk: false,
      };

      placeShip(board, ship);

      expect(board[1][7].status).toBe(CellStatus.SHIP);
      expect(board[1][7].shipId).toBe('ship-2');
      expect(board[2][7].status).toBe(CellStatus.SHIP);
      expect(board[2][7].shipId).toBe('ship-2');
      expect(board[3][7].status).toBe(CellStatus.SHIP);
      expect(board[3][7].shipId).toBe('ship-2');
    });

    it('should place single-cell ship', () => {
      const ship: Ship = {
        id: 'submarine-1',
        type: ShipType.SUBMARINE,
        length: 1,
        position: { row: 9, col: 9 },
        orientation: Orientation.HORIZONTAL,
        hits: 0,
        isSunk: false,
      };

      placeShip(board, ship);

      expect(board[9][9].status).toBe(CellStatus.SHIP);
      expect(board[9][9].shipId).toBe('submarine-1');
    });
  });

  describe('hasAdjacentShips', () => {
    let board: Board;

    beforeEach(() => {
      board = createEmptyBoard();
    });

    it('should detect adjacent ship horizontally', () => {
      board[5][5].status = CellStatus.SHIP;

      expect(hasAdjacentShips(board, { row: 5, col: 6 })).toBe(true);
      expect(hasAdjacentShips(board, { row: 5, col: 4 })).toBe(true);
    });

    it('should detect adjacent ship vertically', () => {
      board[5][5].status = CellStatus.SHIP;

      expect(hasAdjacentShips(board, { row: 4, col: 5 })).toBe(true);
      expect(hasAdjacentShips(board, { row: 6, col: 5 })).toBe(true);
    });

    it('should detect adjacent ship diagonally', () => {
      board[5][5].status = CellStatus.SHIP;

      expect(hasAdjacentShips(board, { row: 4, col: 4 })).toBe(true);
      expect(hasAdjacentShips(board, { row: 4, col: 6 })).toBe(true);
      expect(hasAdjacentShips(board, { row: 6, col: 4 })).toBe(true);
      expect(hasAdjacentShips(board, { row: 6, col: 6 })).toBe(true);
    });

    it('should return false when no adjacent ships', () => {
      board[5][5].status = CellStatus.SHIP;

      expect(hasAdjacentShips(board, { row: 7, col: 7 })).toBe(false);
      expect(hasAdjacentShips(board, { row: 0, col: 0 })).toBe(false);
    });

    it('should handle edge cases at board boundaries', () => {
      board[0][0].status = CellStatus.SHIP;

      expect(hasAdjacentShips(board, { row: 0, col: 1 })).toBe(true);
      expect(hasAdjacentShips(board, { row: 1, col: 0 })).toBe(true);
      expect(hasAdjacentShips(board, { row: 1, col: 1 })).toBe(true);
    });
  });
});
