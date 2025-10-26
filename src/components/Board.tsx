/**
 * @file Komponent planszy (siatka 10x10)
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Cell } from './Cell';
import { Board as BoardType } from '../types';

/**
 * Props dla komponentu Board
 */
export interface BoardProps {
  board: BoardType;
  onCellPress: (row: number, col: number) => void;
  disabled?: boolean;
  showShips?: boolean; // Czy pokazywać okręty (nasza plansza vs plansza przeciwnika)
  title?: string;
}

/**
 * Komponent planszy gry
 *
 * Renderuje siatkę 10x10 komórek z oznaczeniami kolumn (A-J) i wierszy (1-10).
 *
 * @example
 * <Board
 *   board={playerBoard}
 *   onCellPress={(r, c) => console.log(`Clicked ${r},${c}`)}
 *   showShips={true}
 *   title="Your Board"
 * />
 */
export const Board: React.FC<BoardProps> = ({
  board,
  onCellPress,
  disabled = false,
  showShips = true,
  title,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const cellSize = Math.min((screenWidth - 60) / 11, 35); // 11 = 10 cells + 1 label column

  const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rowLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const getCellStatus = (row: number, col: number) => {
    const cell = board[row][col];

    // Jeśli to plansza przeciwnika (showShips=false), ukrywaj okręty
    if (!showShips && cell.status === 'ship') {
      return 'empty' as any;
    }

    return cell.status;
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.boardContainer}>
        {/* Top row - column labels */}
        <View style={styles.labelsRow}>
          <View style={[styles.labelCell, { width: cellSize, height: cellSize }]} />
          {columnLabels.map((label, index) => (
            <View
              key={`col-${index}`}
              style={[styles.labelCell, { width: cellSize, height: cellSize }]}
            >
              <Text style={styles.labelText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Board rows with row labels */}
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.boardRow}>
            {/* Row label */}
            <View style={[styles.labelCell, { width: cellSize, height: cellSize }]}>
              <Text style={styles.labelText}>{rowLabels[rowIndex]}</Text>
            </View>

            {/* Cells */}
            {row.map((_, colIndex) => (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                status={getCellStatus(rowIndex, colIndex)}
                onPress={onCellPress}
                disabled={disabled}
                size={cellSize}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  boardContainer: {
    backgroundColor: '#e8f4f8',
    padding: 5,
    borderRadius: 8,
  },
  labelsRow: {
    flexDirection: 'row',
  },
  boardRow: {
    flexDirection: 'row',
  },
  labelCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c5f77',
  },
});
