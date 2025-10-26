import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚢 Battleships Game</Text>
      <Text style={styles.subtitle}>React Native + TDD</Text>
      <Text style={styles.info}>Development mode active</Text>
      <Text style={styles.version}>v1.0.0</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077be',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 30,
  },
  info: {
    fontSize: 14,
    color: '#b0d4e3',
    marginTop: 20,
  },
  version: {
    fontSize: 12,
    color: '#90c4d3',
    marginTop: 5,
  },
});
