import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import { useStore } from '../../core/store/useStore';

export default function WalletScreen() {
  const character = useStore((s) => s.character);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Wallet</Text>

      {/* Token Balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>EKAM TOKEN BALANCE</Text>
        <Text style={styles.balanceValue}>{character.ekamTokens}</Text>
        <Text style={styles.balanceSuffix}>EKAM</Text>
        <Text style={styles.networkBadge}>Polygon Network</Text>
      </View>

      {/* Coins */}
      <View style={styles.coinCard}>
        <Text style={styles.coinEmoji}>🪙</Text>
        <View>
          <Text style={styles.coinValue}>{character.coins}</Text>
          <Text style={styles.coinLabel}>In-app Coins</Text>
        </View>
      </View>

      {/* Earning Guide */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Earn EKAM</Text>
        {[
          { action: 'Complete Workout', tokens: '10 EKAM', icon: '💪' },
          { action: 'Meditate', tokens: '5 EKAM', icon: '🧘' },
          { action: 'Log Nutrition', tokens: '8 EKAM', icon: '🥗' },
          { action: 'Complete a Book', tokens: '25 EKAM', icon: '📚' },
        ].map((item) => (
          <View key={item.action} style={styles.earnRow}>
            <Text style={styles.earnIcon}>{item.icon}</Text>
            <Text style={styles.earnAction}>{item.action}</Text>
            <Text style={styles.earnTokens}>{item.tokens}</Text>
          </View>
        ))}
      </View>

      {/* Streak Multipliers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Streak Multipliers</Text>
        {[
          { days: '7 days', mult: '1.2x' },
          { days: '30 days', mult: '1.5x' },
          { days: '100 days', mult: '2.0x' },
          { days: '365 days', mult: '3.0x' },
        ].map((item) => (
          <View key={item.days} style={styles.earnRow}>
            <Text style={styles.earnIcon}>🔥</Text>
            <Text style={styles.earnAction}>{item.days}</Text>
            <Text style={styles.earnTokens}>{item.mult}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },
  title: { ...Typography.displaySm, color: Colors.primary, marginBottom: Spacing.lg },

  balanceCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.primaryContainer,
  },
  balanceLabel: { ...Typography.labelMd, color: Colors.textTertiary, textTransform: 'uppercase', marginBottom: Spacing.sm },
  balanceValue: { ...Typography.displayLg, color: Colors.primary },
  balanceSuffix: { ...Typography.titleMd, color: Colors.primaryDim, marginTop: Spacing.xs },
  networkBadge: { ...Typography.labelSm, color: Colors.textTertiary, marginTop: Spacing.md },

  coinCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  coinEmoji: { fontSize: 32 },
  coinValue: { ...Typography.headlineMd, color: Colors.coins },
  coinLabel: { ...Typography.bodySm, color: Colors.textTertiary },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.headlineSm, color: Colors.textPrimary, marginBottom: Spacing.md },
  earnRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md, padding: Spacing.md,
    marginBottom: Spacing.sm, gap: Spacing.md,
  },
  earnIcon: { fontSize: 20 },
  earnAction: { ...Typography.bodyMd, color: Colors.textPrimary, flex: 1 },
  earnTokens: { ...Typography.titleSm, color: Colors.primary },
});
