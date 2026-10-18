import { useState } from 'react';
import { View, Text, StyleSheet, render } from '../src/index';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter</Text>
      <View
        style={styles.button}
        onClick={() => setCount((c) => c + 1)}
        testID="counter-button"
      >
        <Text style={styles.buttonText}>Count: {count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#1a1a1a',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#e2e2e2',
    fontSize: 32,
    marginBottom: 24,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#232323',
    cursor: 'pointer',
  },
  buttonText: {
    color: '#e2e2e2',
    fontSize: 18,
  },
});

if (import.meta.main) {
  render(<App />, { title: 'Counter Example', width: 400, height: 300 });
}
