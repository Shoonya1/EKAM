import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '../../core/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/(auth)/onboarding');
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🧘</Text>
        <Text style={styles.title}>EKAM</Text>
        <Text style={styles.subtitle}>एकम् — The One</Text>
        <Text style={styles.tagline}>One Life. One System.</Text>
      </View>

      <View style={styles.pillars}>
        {['🧠 Mind', '⚔️ Discipline', '💪 Wellness', '📖 Wisdom', '💰 Wealth'].map((p) => (
          <View key={p} style={styles.pillarChip}>
            <Text style={styles.pillarText}>{p}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={handleStart}>
          <Text style={styles.primaryButtonText}>Begin Your Journey</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.displayLg,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.headlineSm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  tagline: {
    ...Typography.bodyLg,
    color: Colors.textTertiary,
  },
  pillars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  pillarChip: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  pillarText: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primaryContainer,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.titleMd,
    color: Colors.onPrimaryContainer,
  },
});
