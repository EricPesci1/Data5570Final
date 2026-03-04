import { StyleSheet, View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <FontAwesome name="bar-chart" size={48} color="#d4af37" style={styles.icon} />
      <Text style={styles.title}>Stats</Text>
      <Text style={styles.subtitle}>Your performance statistics will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b949e',
    textAlign: 'center',
  },
});
