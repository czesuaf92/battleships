/**
 * @file Główny ekran gry - wyświetla obie plansze i zarządza rozgrywką
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Board } from './Board';
import { createGameState, initializeGame } from '../logic/game-state';
import { processTurn } from '../logic/turn-manager';
import { GameState, PlayerId, GamePhase, ShotResult } from '../types';

export const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const state = createGameState('You', 'Opponent');
    initializeGame(state);
    return state;
  });

  const [message, setMessage] = useState('Your turn! Attack the enemy!');

  // Funkcja do wykonania strzału przez gracza
  const handleShot = (row: number, col: number) => {
    if (gameState.phase !== GamePhase.BATTLE) {
      return;
    }

    if (gameState.currentPlayer !== PlayerId.PLAYER_1) {
      setMessage('Wait for opponent turn!');
      return;
    }

    const result = processTurn(gameState, { row, col });

    if (result.error) {
      setMessage(result.error);
      return;
    }

    // Aktualizujemy stan gry
    setGameState({ ...gameState });

    // Wyświetlamy komunikat o wyniku strzału
    if (result.shotResult === ShotResult.SUNK) {
      setMessage(`SUNK! You destroyed ${result.sunkShip?.type}-cell ship! Shoot again!`);
    } else if (result.shotResult === ShotResult.HIT) {
      setMessage('HIT! Shoot again!');
    } else {
      setMessage('MISS! Opponent turn...');
    }

    // Sprawdzamy wygraną
    if (result.winner) {
      if (result.winner === PlayerId.PLAYER_1) {
        setMessage('VICTORY! You won the battle!');
        Alert.alert('Victory!', 'You won the battle!', [
          { text: 'Play Again', onPress: handleRestart },
        ]);
      } else {
        setMessage('DEFEAT! Opponent won the battle!');
        Alert.alert('Defeat', 'Opponent won the battle!', [
          { text: 'Play Again', onPress: handleRestart },
        ]);
      }
      return;
    }

    // Jeśli tura przeszła do przeciwnika, wykonaj jego ruch
    if (!result.continuesTurn) {
      setTimeout(() => executeOpponentTurn(), 1000);
    }
  };

  // AI przeciwnika - losowe strzały
  const executeOpponentTurn = () => {
    if (gameState.phase !== GamePhase.BATTLE || gameState.currentPlayer !== PlayerId.PLAYER_2) {
      return;
    }

    // Znajdź losową wolną komórkę na planszy gracza
    const player1Board = gameState.players[PlayerId.PLAYER_1].board;
    const availableCells: { row: number; col: number }[] = [];

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const status = player1Board[row][col].status;
        if (status === 'empty' || status === 'ship') {
          availableCells.push({ row, col });
        }
      }
    }

    if (availableCells.length === 0) return;

    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    const result = processTurn(gameState, randomCell);

    // Aktualizujemy stan
    setGameState({ ...gameState });

    // Wyświetlamy komunikat
    if (result.shotResult === ShotResult.SUNK) {
      setMessage(`Opponent SUNK your ship! They shoot again...`);
    } else if (result.shotResult === ShotResult.HIT) {
      setMessage('Opponent HIT! They shoot again...');
    } else {
      setMessage('Opponent MISS! Your turn!');
    }

    // Sprawdzamy wygraną
    if (result.winner) {
      if (result.winner === PlayerId.PLAYER_2) {
        setMessage('DEFEAT! Opponent won the battle!');
        Alert.alert('Defeat', 'Opponent won the battle!', [
          { text: 'Play Again', onPress: handleRestart },
        ]);
      }
      return;
    }

    // Jeśli przeciwnik kontynuuje turę, wykonaj kolejny strzał
    if (result.continuesTurn) {
      setTimeout(() => executeOpponentTurn(), 1500);
    }
  };

  // Reset gry
  const handleRestart = () => {
    const state = createGameState('You', 'Opponent');
    initializeGame(state);
    setGameState(state);
    setMessage('Your turn! Attack the enemy!');
  };

  // Zawsze pokazujemy PLAYER_1 jako gracza, PLAYER_2 jako przeciwnika
  const player = gameState.players[PlayerId.PLAYER_1];
  const opponent = gameState.players[PlayerId.PLAYER_2];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Battleships</Text>

      {/* Status gry */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{message}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Your ships: {player.shipsRemaining}
          </Text>
          <Text style={styles.scoreText}>
            Enemy ships: {opponent.shipsRemaining}
          </Text>
        </View>
      </View>

      {/* Plansza przeciwnika (górna) */}
      <Board
        board={opponent.board}
        onCellPress={handleShot}
        disabled={gameState.currentPlayer !== PlayerId.PLAYER_1 || gameState.phase !== GamePhase.BATTLE}
        showShips={false}
        title="Enemy Waters"
      />

      {/* Plansza gracza (dolna) */}
      <Board
        board={player.board}
        onCellPress={() => {}}
        disabled={true}
        showShips={true}
        title="Your Fleet"
      />

      {/* Przycisk restart */}
      <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
        <Text style={styles.restartButtonText}>New Game</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '95%',
    maxWidth: 400,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreText: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  restartButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
