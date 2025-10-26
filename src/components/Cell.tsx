/**
 * @file Komponent pojedynczej komórki planszy
 */

import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  ViewStyle,
  Animated,
} from 'react-native';
import { CellStatus } from '../types';

/**
 * Props dla komponentu Cell
 */
export interface CellProps {
  row: number;
  col: number;
  status: CellStatus;
  onPress: (row: number, col: number) => void;
  disabled?: boolean;
  size?: number; // Rozmiar komórki w pikselach
}

/**
 * Komponent pojedynczej komórki planszy
 *
 * Reprezentuje jedną komórkę w siatce 10x10.
 * Wyświetla różne stany: pusta woda, okręt, pudło, trafienie, zatopiony.
 *
 * @example
 * <Cell
 *   row={5}
 *   col={3}
 *   status={CellStatus.EMPTY}
 *   onPress={(r, c) => console.log(`Clicked ${r},${c}`)}
 * />
 */
export const Cell: React.FC<CellProps> = ({
  row,
  col,
  status,
  onPress,
  disabled = false,
  size = 30,
}) => {
  // Animacja fade-in dla hit/miss
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevStatusRef = useRef(status);

  useEffect(() => {
    // Jeśli status zmienił się na HIT, MISS lub SUNK, uruchom animację
    if (
      prevStatusRef.current !== status &&
      (status === CellStatus.HIT || status === CellStatus.MISS || status === CellStatus.SUNK)
    ) {
      // Resetuj opacity do 0
      fadeAnim.setValue(0);

      // Animuj do pełnej widoczności
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }

    prevStatusRef.current = status;
  }, [status, fadeAnim]);

  const handlePress = () => {
    if (!disabled) {
      onPress(row, col);
    }
  };

  const getCellStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: size,
      height: size,
      borderWidth: 0.5,
      borderColor: '#2c5f77',
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (status) {
      case CellStatus.EMPTY:
        return {
          ...baseStyle,
          backgroundColor: '#4a90a4', // Kolor wody
        };

      case CellStatus.SHIP:
        return {
          ...baseStyle,
          backgroundColor: '#666666', // Szary okręt
        };

      case CellStatus.MISS:
        return {
          ...baseStyle,
          backgroundColor: '#4a90a4',
          // Dodamy białe kółko dla pudła
        };

      case CellStatus.HIT:
        return {
          ...baseStyle,
          backgroundColor: '#ff6b6b', // Czerwone trafienie
        };

      case CellStatus.SUNK:
        return {
          ...baseStyle,
          backgroundColor: '#8b0000', // Ciemnoczerwony zatopiony
        };

      default:
        return baseStyle;
    }
  };

  const getAccessibilityLabel = (): string => {
    const position = `row ${row}, column ${col}`;

    switch (status) {
      case CellStatus.EMPTY:
        return `Empty cell at ${position}`;
      case CellStatus.SHIP:
        return `Ship at ${position}`;
      case CellStatus.MISS:
        return `Miss at ${position}`;
      case CellStatus.HIT:
        return `Hit at ${position}`;
      case CellStatus.SUNK:
        return `Sunk ship at ${position}`;
      default:
        return position;
    }
  };

  const renderIndicator = () => {
    if (status === CellStatus.MISS) {
      // Białe kółko dla pudła z animacją
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View
            style={{
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: size * 0.15,
              backgroundColor: '#ffffff',
            }}
          />
        </Animated.View>
      );
    }

    if (status === CellStatus.HIT || status === CellStatus.SUNK) {
      // Czerwony X dla trafienia z animacją
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ position: 'relative' }}>
            <View
              style={{
                width: size * 0.6,
                height: 2,
                backgroundColor: '#ffffff',
                transform: [{ rotate: '45deg' }],
              }}
            />
            <View
              style={{
                width: size * 0.6,
                height: 2,
                backgroundColor: '#ffffff',
                position: 'absolute',
                transform: [{ rotate: '-45deg' }],
              }}
            />
          </View>
        </Animated.View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      testID={`cell-${row}-${col}`}
      accessible={true}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={handlePress}
      disabled={disabled}
      style={getCellStyle()}
      activeOpacity={0.7}
    >
      {renderIndicator()}
    </TouchableOpacity>
  );
};
