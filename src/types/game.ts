/**
 * @file Typy danych dla gry w Statki
 */

/**
 * Pozycja na planszy (wiersz, kolumna)
 */
export interface Position {
  row: number;    // 0-9
  col: number;    // 0-9
}

/**
 * Orientacja okrętu
 */
export enum Orientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

/**
 * Status komórki na planszy
 */
export enum CellStatus {
  EMPTY = 'empty',           // Pusta woda
  SHIP = 'ship',             // Okręt (niewidoczny dla przeciwnika)
  MISS = 'miss',             // Pudło (strzał w wodę)
  HIT = 'hit',               // Trafienie
  SUNK = 'sunk',             // Część zatopionego okrętu
}

/**
 * Komórka na planszy
 */
export interface Cell {
  position: Position;
  status: CellStatus;
  shipId?: string;           // ID okrętu jeśli komórka zawiera okręt
}

/**
 * Typ okrętu (określa długość)
 */
export enum ShipType {
  CARRIER = 4,      // Lotniskowiec - 4 pola
  BATTLESHIP = 3,   // Pancernik - 3 pola
  CRUISER = 2,      // Krążownik - 2 pola
  SUBMARINE = 1,    // Łódź podwodna - 1 pole
}

/**
 * Okręt gracza
 */
export interface Ship {
  id: string;
  type: ShipType;
  length: number;
  position: Position;        // Pozycja "startowa" (lewy górny róg)
  orientation: Orientation;
  hits: number;              // Ilość trafień
  isSunk: boolean;           // Czy zatopiony
}

/**
 * Plansza gracza (10x10)
 */
export type Board = Cell[][];

/**
 * Identyfikator gracza
 */
export enum PlayerId {
  PLAYER_1 = 'player1',
  PLAYER_2 = 'player2',
}

/**
 * Statystyki gracza
 */
export interface PlayerStats {
  shotsFired: number;        // Całkowita liczba strzałów
  hits: number;              // Liczba trafień
  misses: number;            // Liczba pudeł
  shipsDestroyed: number;    // Liczba zatopionych okrętów
}

/**
 * Dane gracza
 */
export interface Player {
  id: PlayerId;
  name: string;
  board: Board;
  ships: Ship[];
  shipsRemaining: number;    // Ilość nie zatopionych okrętów
  stats: PlayerStats;        // Statystyki gracza
}

/**
 * Faza gry
 */
export enum GamePhase {
  SETUP = 'setup',           // Rozstawianie okrętów
  BATTLE = 'battle',         // Walka
  GAME_OVER = 'game_over',   // Koniec gry
}

/**
 * Wynik strzału
 */
export enum ShotResult {
  MISS = 'miss',             // Pudło
  HIT = 'hit',               // Trafienie
  SUNK = 'sunk',             // Zatopienie
}

/**
 * Stan gry
 */
export interface GameState {
  phase: GamePhase;
  currentPlayer: PlayerId;
  players: {
    [PlayerId.PLAYER_1]: Player;
    [PlayerId.PLAYER_2]: Player;
  };
  winner?: PlayerId;
  turnCount: number;
}

/**
 * Konfiguracja floty - ile okrętów każdego typu
 */
export interface FleetConfig {
  [ShipType.CARRIER]: number;      // 1x okręt 4-polowy
  [ShipType.BATTLESHIP]: number;   // 2x okręty 3-polowe
  [ShipType.CRUISER]: number;      // 3x okręty 2-polowe
  [ShipType.SUBMARINE]: number;    // 4x okręty 1-polowe
}

/**
 * Domyślna konfiguracja floty
 */
export const DEFAULT_FLEET_CONFIG: FleetConfig = {
  [ShipType.CARRIER]: 1,
  [ShipType.BATTLESHIP]: 2,
  [ShipType.CRUISER]: 3,
  [ShipType.SUBMARINE]: 4,
};
