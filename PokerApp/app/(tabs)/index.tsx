import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type FeatureCardProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  description: string;
  onPress: () => void;
};

function FeatureCard({ icon, title, description, onPress }: FeatureCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardIcon}>
        <FontAwesome name={icon} size={26} color="#d4af37" />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color="#555" />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.suitRow}>♠ ♥ ♦ ♣</Text>
        <Text style={styles.title}>OmniscientPoker</Text>
        <Text style={styles.subtitle}>Know your edge at every table</Text>
      </View>

      {/* Feature Cards */}
      <View style={styles.cardsContainer}>
        <FeatureCard
          icon="list"
          title="Sessions"
          description="Log and review your poker sessions"
          onPress={() => router.push('/(tabs)/sessions')}
        />
        <FeatureCard
          icon="users"
          title="Player Notes"
          description="Track tendencies and reads on opponents"
          onPress={() => router.push('/(tabs)/playernotes')}
        />
        <FeatureCard
          icon="bar-chart"
          title="Stats"
          description="Analyze your performance over time"
          onPress={() => router.push('/(tabs)/stats')}
        />
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Play smarter. Win more.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  suitRow: {
    fontSize: 22,
    color: '#d4af37',
    letterSpacing: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    letterSpacing: 0.5,
  },
  cardsContainer: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e2a3a',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 12,
    color: '#8b949e',
  },
  footer: {
    textAlign: 'center',
    color: '#3d4450',
    fontSize: 12,
    marginTop: 'auto',
    paddingTop: 24,
    letterSpacing: 1,
  },
});
