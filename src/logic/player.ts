/**
 * @file Logika inicjalizacji gracza i floty
 */

import {
  Player,
  PlayerId,
  Ship,
  ShipType,
  Orientation,
  FleetConfig,
  DEFAULT_FLEET_CONFIG,
} from '../types';
import { createEmptyBoard } from './board';

/**
 * Tworzy nowego gracza z pustą planszą
 *
 * @param id - Identyfikator gracza (PLAYER_1 lub PLAYER_2)
 * @param name - Nazwa gracza
 * @returns Nowy gracz z pustą planszą i bez okrętów
 *
 * @example
 * const player = createPlayer(PlayerId.PLAYER_1, 'Alice');
 * console.log(player.name); // 'Alice'
 * console.log(player.ships.length); // 0
 */
export function createPlayer(id: PlayerId, name: string): Player {
  return {
    id,
    name,
    board: createEmptyBoard(),
    ships: [],
    shipsRemaining: 0,
    stats: {
      shotsFired: 0,
      hits: 0,
      misses: 0,
      shipsDestroyed: 0,
    },
  };
}

/**
 * Tworzy flotę okrętów według konfiguracji
 *
 * Domyślna konfiguracja (DEFAULT_FLEET_CONFIG):
 * - 1x Carrier (4 pola)
 * - 2x Battleship (3 pola)
 * - 3x Cruiser (2 pola)
 * - 4x Submarine (1 pole)
 *
 * @param config - Konfiguracja floty (opcjonalna, domyślnie DEFAULT_FLEET_CONFIG)
 * @returns Tablica okrętów gotowych do rozstawienia
 *
 * @example
 * const fleet = createFleet();
 * console.log(fleet.length); // 10 okrętów
 *
 * const customFleet = createFleet({
 *   [ShipType.CARRIER]: 2,
 *   [ShipType.BATTLESHIP]: 1,
 *   [ShipType.CRUISER]: 0,
 *   [ShipType.SUBMARINE]: 0
 * });
 * console.log(customFleet.length); // 3 okręty
 */
export function createFleet(config: FleetConfig = DEFAULT_FLEET_CONFIG): Ship[] {
  const fleet: Ship[] = [];
  let shipCounter = {
    [ShipType.CARRIER]: 0,
    [ShipType.BATTLESHIP]: 0,
    [ShipType.CRUISER]: 0,
    [ShipType.SUBMARINE]: 0,
  };

  // Tworzenie okrętów według konfiguracji
  Object.entries(config).forEach(([shipTypeStr, count]) => {
    const shipType = Number(shipTypeStr) as ShipType;

    for (let i = 0; i < count; i++) {
      shipCounter[shipType]++;

      const shipName = getShipTypeName(shipType);
      const ship: Ship = {
        id: `${shipName}-${shipCounter[shipType]}`,
        type: shipType,
        length: shipType, // ShipType enum value = długość okrętu
        position: { row: 0, col: 0 }, // Placeholder - będzie ustawione podczas rozstawiania
        orientation: Orientation.HORIZONTAL, // Domyślna orientacja
        hits: 0,
        isSunk: false,
      };

      fleet.push(ship);
    }
  });

  return fleet;
}

/**
 * Pomocnicza funkcja do mapowania ShipType na nazwę
 */
function getShipTypeName(type: ShipType): string {
  switch (type) {
    case ShipType.CARRIER:
      return 'carrier';
    case ShipType.BATTLESHIP:
      return 'battleship';
    case ShipType.CRUISER:
      return 'cruiser';
    case ShipType.SUBMARINE:
      return 'submarine';
    default:
      return 'unknown';
  }
}

/**
 * Sprawdza czy cała flota gracza została zniszczona
 *
 * Flota jest zniszczona gdy wszystkie okręty są zatopione (isSunk = true)
 *
 * @param player - Gracz do sprawdzenia
 * @returns true jeśli wszystkie okręty zatopione, false w przeciwnym przypadku
 *
 * @example
 * const player = createPlayer(PlayerId.PLAYER_1, 'Alice');
 * player.ships = createFleet();
 *
 * isFleetDestroyed(player); // false (nowe okręty)
 *
 * // Po zatopieniu wszystkich okrętów
 * player.ships.forEach(ship => {
 *   ship.hits = ship.length;
 *   ship.isSunk = true;
 * });
 * isFleetDestroyed(player); // true
 */
export function isFleetDestroyed(player: Player): boolean {
  // Jeśli gracz nie ma okrętów, flota nie jest zniszczona (technicznie)
  if (player.ships.length === 0) {
    return false;
  }

  // Sprawdzamy czy wszystkie okręty są zatopione
  return player.ships.every((ship) => ship.isSunk);
}
