/**
 * @file Ekran rozmieszczania okrętów przed bitwą
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Board as BoardType,
  Ship,
  ShipType,
  Orientation,
  Position,
  DEFAULT_FLEET_CONFIG,
} from '../types';
import { Board } from './Board';
import { canPlaceShip, placeShip } from '../logic/ship-placement';
import { autoPlaceShips } from '../logic/auto-placement';
import { createEmptyBoard } from '../logic/board';
import { createFleet } from '../logic/player';

/**
 * Props dla ShipPlacementScreen
 */
export interface ShipPlacementScreenProps {
  onComplete: (board: BoardType, ships: Ship[]) => void;
  playerName: string;
}

/**
 * Informacje o typie statku do wyświetlenia
 */
interface ShipTypeInfo {
  type: ShipType;
  name: string;
  length: number;
  count: number;
}

/**
 * Ekran rozmieszczania okrętów
 *
 * Umożliwia:
 * - Wybór typu okrętu
 * - Wybór orientacji (H/V)
 * - Kliknięcie na planszy → umieszczenie okrętu
 * - Podgląd przed umieszczeniem
 * - Przyciski: Clear All, Random, Start Battle
 */
export const ShipPlacementScreen: React.FC<ShipPlacementScreenProps> = ({
  onComplete,
  playerName,
}) => {
  // Stan planszy i okrętów
  const [board, setBoard] = useState<BoardType>(() => createEmptyBoard());
  const [ships, setShips] = useState<Ship[]>([]);

  // Stan UI
  const [selectedShipType, setSelectedShipType] = useState<ShipType | null>(null);
  const [orientation, setOrientation] = useState<Orientation>(Orientation.HORIZONTAL);
  const [previewPosition, setPreviewPosition] = useState<Position | null>(null);

  // Konfiguracja floty
  const shipTypes: ShipTypeInfo[] = [
    { type: ShipType.CARRIER, name: 'Lotniskowiec', length: 4, count: DEFAULT_FLEET_CONFIG[ShipType.CARRIER] },
    { type: ShipType.BATTLESHIP, name: 'Pancernik', length: 3, count: DEFAULT_FLEET_CONFIG[ShipType.BATTLESHIP] },
    { type: ShipType.CRUISER, name: 'Krążownik', length: 2, count: DEFAULT_FLEET_CONFIG[ShipType.CRUISER] },
    { type: ShipType.SUBMARINE, name: 'Łódź podwodna', length: 1, count: DEFAULT_FLEET_CONFIG[ShipType.SUBMARINE] },
  ];

  /**
   * Oblicza ile okrętów danego typu zostało już umieszczonych
   */
  const getPlacedCount = (type: ShipType): number => {
    return ships.filter(ship => ship.type === type).length;
  };

  /**
   * Oblicza ile okrętów danego typu pozostało do umieszczenia
   */
  const getRemainingCount = (type: ShipType): number => {
    const config = DEFAULT_FLEET_CONFIG[type];
    return config - getPlacedCount(type);
  };

  /**
   * Sprawdza czy wszystkie okręty zostały umieszczone
   */
  const isFleetComplete = (): boolean => {
    return shipTypes.every(info => getRemainingCount(info.type) === 0);
  };

  /**
   * Obsługa kliknięcia w komórkę planszy
   */
  const handleCellPress = (row: number, col: number) => {
    if (!selectedShipType) {
      Alert.alert('Wybierz okręt', 'Najpierw wybierz typ okrętu do umieszczenia');
      return;
    }

    const position: Position = { row, col };
    const length = selectedShipType as number;

    // Sprawdź czy można umieścić okręt
    if (!canPlaceShip(board, position, length, orientation)) {
      Alert.alert(
        'Nieprawidłowa pozycja',
        'Okręt nie może się tutaj zmieścić lub dotyka innego okrętu'
      );
      return;
    }

    // Utwórz nowy okręt
    const newShip: Ship = {
      id: `ship-${ships.length + 1}`,
      type: selectedShipType,
      length,
      position,
      orientation,
      hits: 0,
      isSunk: false,
    };

    // Umieść okręt na planszy (modyfikuje board in-place)
    placeShip(board, newShip);
    setBoard([...board]); // Tworzymy nową referencję dla React
    setShips([...ships, newShip]);

    // Jeśli to był ostatni okręt tego typu, wyczyść wybór
    if (getRemainingCount(selectedShipType) === 1) {
      setSelectedShipType(null);
    }
  };

  /**
   * Przełącz orientację
   */
  const toggleOrientation = () => {
    setOrientation(prev =>
      prev === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL
    );
  };

  /**
   * Wyczyść wszystkie okręty
   */
  const handleClearAll = () => {
    setBoard(createEmptyBoard());
    setShips([]);
    setSelectedShipType(null);
  };

  /**
   * Losowe rozmieszczenie okrętów
   */
  const handleRandom = () => {
    const newBoard = createEmptyBoard();
    const newShips = createFleet();
    autoPlaceShips(newBoard, newShips);
    setBoard(newBoard);
    setShips(newShips);
    setSelectedShipType(null);
  };

  /**
   * Rozpocznij bitwę
   */
  const handleStartBattle = () => {
    if (!isFleetComplete()) {
      Alert.alert(
        'Flota niekompletna',
        'Umieść wszystkie okręty przed rozpoczęciem bitwy'
      );
      return;
    }

    onComplete(board, ships);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Nagłówek */}
        <Text style={styles.title}>{playerName} - Rozmieść okręty</Text>

        {/* Selektor okrętów */}
        <View style={styles.shipSelector}>
          <Text style={styles.sectionTitle}>Wybierz okręt:</Text>
          {shipTypes.map((shipInfo) => {
            const remaining = getRemainingCount(shipInfo.type);
            const isSelected = selectedShipType === shipInfo.type;
            const isAvailable = remaining > 0;

            return (
              <TouchableOpacity
                key={shipInfo.type}
                style={[
                  styles.shipButton,
                  isSelected && styles.shipButtonSelected,
                  !isAvailable && styles.shipButtonDisabled,
                ]}
                onPress={() => isAvailable && setSelectedShipType(shipInfo.type)}
                disabled={!isAvailable}
              >
                <Text style={styles.shipButtonText}>
                  {shipInfo.name} ({shipInfo.length})
                </Text>
                <Text style={styles.shipCount}>
                  Pozostało: {remaining}/{shipInfo.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Przełącznik orientacji */}
        {selectedShipType && (
          <View style={styles.orientationContainer}>
            <Text style={styles.sectionTitle}>Orientacja:</Text>
            <View style={styles.orientationButtons}>
              <TouchableOpacity
                style={[
                  styles.orientationButton,
                  orientation === Orientation.HORIZONTAL && styles.orientationButtonActive,
                ]}
                onPress={() => setOrientation(Orientation.HORIZONTAL)}
              >
                <Text style={styles.orientationButtonText}>
                  Poziomo →
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.orientationButton,
                  orientation === Orientation.VERTICAL && styles.orientationButtonActive,
                ]}
                onPress={() => setOrientation(Orientation.VERTICAL)}
              >
                <Text style={styles.orientationButtonText}>
                  Pionowo ↓
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Instrukcja */}
        <Text style={styles.instruction}>
          {selectedShipType
            ? 'Kliknij na planszy, aby umieścić okręt'
            : 'Wybierz typ okrętu powyżej'}
        </Text>

        {/* Plansza */}
        <Board
          board={board}
          onCellPress={handleCellPress}
          showShips={true}
          disabled={false}
        />

        {/* Przyciski sterujące */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.clearButton]}
            onPress={handleClearAll}
            disabled={ships.length === 0}
          >
            <Text style={styles.controlButtonText}>Wyczyść wszystko</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.randomButton]}
            onPress={handleRandom}
          >
            <Text style={styles.controlButtonText}>Losowo</Text>
          </TouchableOpacity>
        </View>

        {/* Przycisk Start Battle */}
        <TouchableOpacity
          style={[
            styles.startButton,
            isFleetComplete() && styles.startButtonEnabled,
          ]}
          onPress={handleStartBattle}
          disabled={!isFleetComplete()}
        >
          <Text style={styles.startButtonText}>
            {isFleetComplete() ? '⚔️ Rozpocznij bitwę!' : 'Umieść wszystkie okręty'}
          </Text>
        </TouchableOpacity>

        {/* Licznik okrętów */}
        <Text style={styles.counter}>
          Umieszczono: {ships.length} / 10
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a4d5e',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  shipSelector: {
    width: '100%',
    marginBottom: 20,
  },
  shipButton: {
    backgroundColor: '#2c5f77',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  shipButtonSelected: {
    backgroundColor: '#3a7ca5',
    borderColor: '#4a90a4',
  },
  shipButtonDisabled: {
    backgroundColor: '#1a3a4d',
    opacity: 0.5,
  },
  shipButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shipCount: {
    color: '#a0c4d4',
    fontSize: 14,
    marginTop: 5,
  },
  orientationContainer: {
    width: '100%',
    marginBottom: 20,
  },
  orientationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orientationButton: {
    flex: 1,
    backgroundColor: '#2c5f77',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  orientationButtonActive: {
    backgroundColor: '#3a7ca5',
    borderColor: '#4a90a4',
  },
  orientationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#a0c4d4',
    marginBottom: 15,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  controlButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#d9534f',
  },
  randomButton: {
    backgroundColor: '#5bc0de',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startButton: {
    width: '100%',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: '#666666',
  },
  startButtonEnabled: {
    backgroundColor: '#5cb85c',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  counter: {
    fontSize: 14,
    color: '#a0c4d4',
    marginTop: 10,
  },
});
